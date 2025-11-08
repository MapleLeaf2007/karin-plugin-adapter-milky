import { dir } from './dir'
import {
  watch,
  logger,
  filesByExt,
  copyConfigSync,
  requireFileSync,
} from 'node-karin'

/**
 * Milky适配器配置接口
 */
export interface MilkyConfig {
  /** WebSocket配置 */
  websocket: {
    /** 是否启用 */
    enable: boolean
    /** WebSocket服务器地址 */
    url: string
    /** 访问令牌 */
    accessToken?: string
    /** 是否自动重连 */
    autoReconnect?: boolean
    /** 重连间隔(ms) */
    reconnectInterval?: number
    /** 最大重连次数 */
    maxReconnectAttempts?: number
    /** 超时时间(ms) */
    timeout?: number
  }
  /** HTTP配置 */
  http: {
    /** 是否启用 */
    enable: boolean
    /** API基础URL */
    baseUrl: string
    /** 访问令牌 */
    accessToken?: string
    /** 超时时间(ms) */
    timeout?: number
  }
}

/**
 * @description 初始化配置文件
 */
copyConfigSync(dir.defConfigDir, dir.ConfigDir, ['.json'])

/**
 * @description 获取配置文件
 */
export const config = (): MilkyConfig => {
  const cfg = requireFileSync(`${dir.ConfigDir}/config.json`)
  const def = requireFileSync(`${dir.defConfigDir}/config.json`)
  return { ...def, ...cfg } as MilkyConfig
}

/**
 * @description 监听配置文件
 */
setTimeout(() => {
  const list = filesByExt(dir.ConfigDir, '.json', 'abs')
  list.forEach(file => watch(file, () => {
    logger.info('[Milky] 检测到配置文件更新，请重启以应用更改')
  }))
}, 2000)
