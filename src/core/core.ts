import { EventEmitter } from 'node:events'
import type { MilkyCoreOptions } from './types'

/**
 * Milky核心类
 * 提供基础连接管理和事件处理
 */
export abstract class MilkyCore extends EventEmitter {
  /** 是否主动关闭 */
  protected _manualClosed: boolean = false

  /** 协议信息 */
  protocol: {
    /** 协议名称 */
    name: string
    /** 协议版本 */
    version: string
    /** 协议连接时间 */
    connectTime: number
  }

  /** 机器人信息 */
  self: {
    /** 机器人ID */
    id: string
    /** 机器人昵称 */
    nickname: string
    /** 机器人头像 */
    avatar: string
  }

  /** 配置 */
  protected _options: {
    timeout: number
  }

  constructor (options?: MilkyCoreOptions) {
    super()

    this.protocol = {
      name: 'Milky',
      version: '1.0.0',
      connectTime: Date.now(),
    }

    this._options = {
      timeout: options?.timeout || 120 * 1000,
    }

    this.self = {
      id: '0',
      nickname: '',
      avatar: '',
    }
  }

  /**
   * 关闭连接
   */
  abstract close (): void

  /**
   * 初始化连接
   */
  abstract init (): Promise<void>
}
