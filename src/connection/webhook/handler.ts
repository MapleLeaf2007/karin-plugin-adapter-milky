import { Client } from '@/core/Client'
import { Event } from '@saltify/milky-types'
import { logger } from 'node-karin'

class Hander {
  private ClientMap: Map<number, Client>
  constructor () {
    this.ClientMap = new Map()
  }

  register () { }
  handle (data: Event) {
    const client = this.ClientMap.get(data.self_id)
    if (!client) {
      logger.debug('[milky Adapter]收到未知请求', data)
    }
  }
}
export const WebHookHander = new Hander()
