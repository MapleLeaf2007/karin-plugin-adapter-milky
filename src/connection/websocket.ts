import { Client } from '@/core/Client'
import { AdapterName } from '@/utils'
import { Event } from '@saltify/milky-types'
import { logger } from 'node-karin'
import { WebSocket } from 'ws'

export class WebSocketHandle {
  #init = false
  #wss: WebSocket | null = null
  #readyPromise: Promise<void>
  #manualClose = false
  #reconnectAttempts = 0
  #maxReconnectAttempts = 10
  #emitOfflineAfter = 3 // 超过3次失败后触发 system_offline
  #reconnectTimer: NodeJS.Timeout | null = null

  client: Client
  Time = 0
  Interval: NodeJS.Timeout | null = null

  constructor (client: Client) {
    this.client = client
    this.#readyPromise = this.init()
  }

  async init () {
    if (this.#init) return
    this.#init = true
    this.#manualClose = false
    this.#reconnectAttempts = 0
    await this.connect()
  }

  /** 建立连接 */
  private async connect () {
    try {
      this.#wss = new WebSocket(this.client.self.EventUrl, {
        headers: { Authorization: `Bearer ${this.client.self.token}` },
      })

      await new Promise<void>((resolve, reject) => {
        this.#wss!.once('open', () => {
          this.onOpen()
          resolve()
        })
        this.#wss!.once('error', reject)
      })

      this.EventListeners()
    } catch (err) {
      logger.error(`[${AdapterName}] WebSocket 连接失败: ${String(err)}`)
      this.scheduleReconnect()
    }
  }

  /** 连接成功 */
  private onOpen () {
    this.Time = Date.now()
    this.#reconnectAttempts = 0
    logger.info(`[${AdapterName}] WebSocket 连接成功`)

    // 定时更新连接时长
    if (this.Interval) clearInterval(this.Interval)
    this.Interval = setInterval(() => {
      this.client.self.connectTime = Date.now() - this.Time
    }, 10_000)
  }

  /** 绑定事件 */
  private EventListeners () {
    if (!this.#wss) return

    this.#wss.on('message', (raw) => {
      try {
        const event = JSON.parse(raw.toString()) as Event
        this.client.emit(event.event_type, event as any)
      } catch (err) {
        logger.warn(`[${AdapterName}] 消息解析失败: ${err}`)
      }
    })

    this.#wss.on('close', (code, reason) => {
      logger.warn(`[${AdapterName}] WebSocket 关闭 code=${code} reason=${reason}`)
      this.handleClose()
    })

    this.#wss.on('error', (err) => {
      logger.error(`[${AdapterName}] WebSocket 错误: ${err}`)
      this.#wss?.close()
    })
  }

  /** 处理关闭 */
  private handleClose () {
    this.clearInterval()
    this.#wss?.removeAllListeners()
    this.#wss = null

    if (this.#manualClose) {
      this.client.emit('system_offline', 'WebSocket 已关闭')
      return
    }

    this.scheduleReconnect()
  }

  /** 清理连接时间定时器 */
  private clearInterval () {
    if (this.Interval) {
      clearInterval(this.Interval)
      this.Interval = null
    }
  }

  /** 计划重连 */
  private scheduleReconnect () {
    if (this.#manualClose) return
    if (this.#reconnectAttempts >= this.#maxReconnectAttempts) {
      logger.error(`[${AdapterName}] 重连失败次数过多，停止重试`)
      this.emitFinalOffline('WebSocket 重连失败次数过多')
      return
    }

    const delay = Math.min(30_000, 2000 * (this.#reconnectAttempts + 1))
    this.#reconnectAttempts++

    logger.warn(`[${AdapterName}] ${delay / 1000}s 后尝试第 ${this.#reconnectAttempts} 次重连`)

    if (this.#reconnectTimer) clearTimeout(this.#reconnectTimer)
    this.#reconnectTimer = setTimeout(() => this.reconnect(), delay)
  }

  /** 尝试重连 */
  private async reconnect () {
    try {
      await this.connect()
    } catch {
      if (this.#reconnectAttempts >= this.#emitOfflineAfter) {
        this.emitFinalOffline(`重连 ${this.#reconnectAttempts} 次失败，已离线`)
      } else {
        this.scheduleReconnect()
      }
    }
  }

  /** 真正触发 offline */
  private emitFinalOffline (msg: string) {
    logger.error(`[${AdapterName}] ${msg}`)
    this.clear()
    this.client.emit('system_offline', msg)
  }

  /** 手动清理 */
  clear () {
    this.#manualClose = true
    this.clearInterval()

    if (this.#reconnectTimer) {
      clearTimeout(this.#reconnectTimer)
      this.#reconnectTimer = null
    }

    if (this.#wss) {
      try {
        this.#wss.removeAllListeners()
        if (
          this.#wss.readyState === WebSocket.OPEN ||
          this.#wss.readyState === WebSocket.CONNECTING
        ) {
          this.#wss.close()
        }
      } catch (err) {
        logger.error(`[${AdapterName}] 清理WebSocket错误:`, err)
      } finally {
        this.#wss = null
      }
    }

    this.#init = false
  }

  /** 等待 ready */
  ready () {
    return this.#readyPromise
  }
}
