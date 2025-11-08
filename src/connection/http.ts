import { MilkyCore } from '../core/core'
import type { MilkyCoreOptions } from '../core/types'
import type { ApiResponse } from '../api'

/**
 * HTTP连接配置
 */
export interface MilkyHttpOptions extends MilkyCoreOptions {
  /** API基础URL */
  baseUrl: string
  /** 访问令牌 */
  accessToken?: string
}

/**
 * Milky HTTP客户端
 */
export class MilkyHttp extends MilkyCore {
  private readonly baseUrl: string
  private readonly headers: Record<string, string>

  constructor (options: MilkyHttpOptions) {
    super(options)
    this.baseUrl = options.baseUrl.endsWith('/') ? options.baseUrl.slice(0, -1) : options.baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    if (options.accessToken) {
      this.headers['Authorization'] = `Bearer ${options.accessToken}`
    }
  }

  /**
   * 调用API
   */
  async callApi<T = unknown>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const url = `${this.baseUrl}/api/${method}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(this._options.timeout),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json() as ApiResponse<T>

      if (result.status === 'failed') {
        throw new Error(`API调用失败 (retcode: ${result.retcode}): ${result.message}`)
      }

      return result.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`调用API ${method} 失败: ${error.message}`)
      }
      throw error
    }
  }

  /**
   * 初始化连接
   */
  async init (): Promise<void> {
    // HTTP模式下不需要特殊初始化
    // 可以在这里获取机器人信息
  }

  /**
   * 关闭连接
   */
  close (): void {
    this._manualClosed = true
    this.removeAllListeners()
  }
}
