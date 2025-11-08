import WebSocket from 'ws'
import { MilkyCore } from '../core/core'
import type { MilkyCoreOptions } from '../core/types'
import type { ApiResponse } from '../api'

/**
 * WebSocket连接配置
 */
export interface MilkyWebSocketOptions extends MilkyCoreOptions {
  /** WebSocket URL */
  url: string
  /** 访问令牌 */
  accessToken?: string
  /** 是否自动重连 */
  autoReconnect?: boolean
  /** 重连间隔(ms) */
  reconnectInterval?: number
  /** 最大重连次数 */
  maxReconnectAttempts?: number
}

/**
 * Milky WebSocket客户端
 */
export class MilkyWebSocket extends MilkyCore {
  private ws: WebSocket | null = null
  private readonly url: string
  private readonly accessToken?: string
  private readonly autoReconnect: boolean
  private readonly reconnectInterval: number
  private readonly maxReconnectAttempts: number
  private reconnectAttempts: number = 0
  private reconnectTimer?: NodeJS.Timeout
  private apiCallbacks: Map<string, {
    resolve: (value: unknown) => void
    reject: (reason?: unknown) => void
    timeout: NodeJS.Timeout
  }> = new Map()

  private callId: number = 0

  constructor (options: MilkyWebSocketOptions) {
    super(options)
    this.url = options.url
    this.accessToken = options.accessToken
    this.autoReconnect = options.autoReconnect ?? true
    this.reconnectInterval = options.reconnectInterval ?? 5000
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10
  }

  /**
   * 初始化WebSocket连接
   */
  async init (): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const headers: Record<string, string> = {}
        if (this.accessToken) {
          headers['Authorization'] = `Bearer ${this.accessToken}`
        }

        this.ws = new WebSocket(this.url, { headers })

        this.ws.on('open', () => {
          this.reconnectAttempts = 0
          this.emit('connected')
          resolve()
        })

        this.ws.on('message', (data: WebSocket.Data) => {
          this.handleMessage(data)
        })

        this.ws.on('error', (error) => {
          this.emit('error', error)
          reject(error)
        })

        this.ws.on('close', () => {
          this.handleClose()
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage (data: WebSocket.Data): void {
    try {
      const message = JSON.parse(data.toString())

      // 检查是否是API响应
      if (message.echo !== undefined) {
        this.handleApiResponse(message)
        return
      }

      // 处理事件
      if (message.event_type) {
        this.emit(message.event_type, message)
        this.emit('event', message)
      }
    } catch (error) {
      this.emit('error', new Error(`解析消息失败: ${error}`))
    }
  }

  /**
   * 处理API响应
   */
  private handleApiResponse (response: ApiResponse & { echo: string }): void {
    const callback = this.apiCallbacks.get(response.echo)
    if (!callback) return

    clearTimeout(callback.timeout)
    this.apiCallbacks.delete(response.echo)

    if (response.status === 'ok') {
      callback.resolve(response.data)
    } else {
      callback.reject(new Error(`API调用失败 (retcode: ${response.retcode}): ${response.message}`))
    }
  }

  /**
   * 处理连接关闭
   */
  private handleClose (): void {
    this.emit('disconnected')

    if (this._manualClosed) return

    if (this.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      this.emit('reconnecting', this.reconnectAttempts)

      this.reconnectTimer = setTimeout(() => {
        this.init().catch((error) => {
          this.emit('error', error)
        })
      }, this.reconnectInterval)
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', new Error('达到最大重连次数'))
    }
  }

  /**
   * 调用API
   */
  async callApi<T = unknown>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket未连接')
    }

    return new Promise((resolve, reject) => {
      const echo = `${++this.callId}`
      const message = {
        action: method,
        params,
        echo,
      }

      const timeout = setTimeout(() => {
        this.apiCallbacks.delete(echo)
        reject(new Error(`API调用超时: ${method}`))
      }, this._options.timeout)

      this.apiCallbacks.set(echo, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timeout,
      })

      this.ws!.send(JSON.stringify(message))
    })
  }

  /**
   * 关闭连接
   */
  close (): void {
    this._manualClosed = true

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    // 清理所有待处理的API调用
    for (const callback of this.apiCallbacks.values()) {
      clearTimeout(callback.timeout)
      callback.reject(new Error('连接已关闭'))
    }
    this.apiCallbacks.clear()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.removeAllListeners()
  }
}
