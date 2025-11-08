import EventEmitter from 'events'
import axios, { AxiosInstance } from 'node-karin/axios'
import { Event, GetImplInfoOutput, GetLoginInfoOutput } from '@saltify/milky-types'
import { BotCfg } from '@/config/types'

interface Events {
  offline: (data: Extract<Event, { event_type: 'bot_offline' }>) => void
}
type ApiResponse<T = unknown> =
  | {
    status: 'ok'
    retcode: 0
    data: T
  }
  | {
    status: 'failed'
    retcode: number
    message: string
  }

export class Client extends EventEmitter {
  private axios: AxiosInstance
  constructor (cfg: BotCfg) {
    super()
    const url = new URL('api', cfg.url.endsWith('/') ? cfg.url : cfg.url + '/').toString()
    this.axios = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${cfg.token}`
      }
    })
  }

  on<K extends keyof Events> (event: K, listener: Events[K]): this {
    return super.on(event, listener)
  }

  emit<K extends keyof Events> (event: K, ...args: Parameters<Events[K]>) {
    return super.emit(event, ...args)
  }

  private async request<T> (path: string, data?: any) {
    const res = await this.axios.post<ApiResponse<T>>(path, data ?? {})
    if (res.data.status === 'failed') {
      throw new Error(res.data.message)
    } else {
      return res.data.data
    }
  }

  /** 获取登录信息 */
  async getLoginInfo () {
    return await this.request<GetLoginInfoOutput>('/get_login_info', {})
  }

  /** 获取协议端信息 */
  async getImplInfo () {
    return await this.request<GetImplInfoOutput>('/get_impl_info', {})
  }
}
