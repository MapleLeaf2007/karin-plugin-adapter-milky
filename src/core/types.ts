import type { MilkyHttp } from '../connection/http'
import type { MilkyWebSocket } from '../connection/websocket'

/**
 * Milky实例类型
 */
export type MilkyType = MilkyHttp | MilkyWebSocket

/**
 * Milky核心配置选项
 */
export interface MilkyCoreOptions {
  /** 请求超时时间(ms) */
  timeout?: number
}
