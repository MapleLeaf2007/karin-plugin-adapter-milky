import { AdapterBase, registerBot, unregisterBot, logger } from 'node-karin'
import { MilkyWebSocket } from '../connection/websocket'
import { createMessage } from './message'
import type { Contact, SendElement, SendMsgResults } from 'node-karin'
import type { MilkyType } from '../core/types'

/**
 * Milky适配器
 * 将Milky协议适配到Karin
 */
export class AdapterMilky extends AdapterBase {
  #isInit = false
  _milky: MilkyType

  constructor (milky: MilkyType) {
    super()
    this.adapter.platform = 'qq'
    this.adapter.standard = 'other'  // Milky不在标准列表中，使用'other'
    this._milky = milky
  }

  async init () {
    if (this.#isInit) return
    this.#isInit = true

    await this._milky.init()
    this.setAdapterInfo()

    // 监听消息接收事件
    this._milky.on('message_receive', (data) => {
      createMessage(data, this)
    })

    // TODO: 监听其他事件
  }

  /**
   * 注册机器人
   */
  registerBot () {
    const commType = this._milky instanceof MilkyWebSocket ? 'webSocketClient' : 'http'
    logger.bot('info', this.selfId, `[Milky][${commType}] 连接成功`)
    this.adapter.index = registerBot(commType, this)
  }

  /**
   * 卸载注册的机器人
   */
  unregisterBot () {
    unregisterBot('index', this.adapter.index)
    logger.bot('info', this.selfId, '连接关闭')
  }

  /** 设置适配器信息 */
  setAdapterInfo () {
    this.adapter.platform = 'qq'
    this.adapter.name = this._milky.protocol.name
    this.adapter.version = this._milky.protocol.version
    this.adapter.protocol = 'other'  // Milky不在协议列表中，使用'other'
  }

  /** 设置机器人信息 */
  setBotInfo () {
    this.account.selfId = this._milky.self.id
    this.account.name = this._milky.self.nickname
    this.account.avatar = this._milky.self.avatar
    this.account.uin = this._milky.self.id
    this.account.uid = this._milky.self.id
  }

  /**
   * 发送消息
   */
  async sendMsg (contact: Contact, elements: Array<SendElement>, retryCount = 0): Promise<SendMsgResults> {
    // TODO: 转换Karin消息格式到Milky格式
    const milkyMessage = this.convertToMilkyMessage(elements)

    if (contact.scene === 'friend') {
      const result = await this._milky.callApi('send_private_message', {
        user_id: contact.peer,
        message: milkyMessage
      }) as any
      return {
        messageId: String(result.message_seq),
        time: Number(result.time),
        rawData: result,
        message_id: String(result.message_seq),
        messageTime: Number(result.time)
      }
    } else if (contact.scene === 'group') {
      const result = await this._milky.callApi('send_group_message', {
        group_id: contact.peer,
        message: milkyMessage
      }) as any
      return {
        messageId: String(result.message_seq),
        time: Number(result.time),
        rawData: result,
        message_id: String(result.message_seq),
        messageTime: Number(result.time)
      }
    }

    throw new Error(`不支持的场景类型: ${contact.scene}`)
  }

  /**
   * 撤回消息
   */
  async recallMsg (contact: Contact, messageId: string): Promise<void> {
    if (contact.scene === 'friend') {
      await this._milky.callApi('recall_private_message', {
        user_id: contact.peer,
        message_seq: BigInt(messageId)
      })
    } else if (contact.scene === 'group') {
      await this._milky.callApi('recall_group_message', {
        group_id: contact.peer,
        message_seq: BigInt(messageId)
      })
    }
  }

  /**
   * 获取头像URL
   */
  async getAvatarUrl (userId: string, size: 0 | 40 | 100 | 140 = 0): Promise<string> {
    // Milky协议中可能需要通过其他方式获取
    return `https://q1.qlogo.cn/g?b=qq&nk=${userId}&s=${size || 100}`
  }

  /**
   * 转换Karin消息元素到Milky消息格式
   */
  private convertToMilkyMessage (elements: Array<SendElement>): Array<any> {
    const milkyMessage: any[] = []

    for (const element of elements) {
      // 如果是字符串，转换为文本消息
      if (typeof element === 'string') {
        milkyMessage.push({ type: 'text', data: { text: element } })
        continue
      }

      // 如果已经是正确的格式，直接使用
      if (typeof element === 'object' && element !== null && 'type' in element) {
        const el: any = element
        // 根据类型进行格式转换
        switch (el.type) {
          case 'text':
            milkyMessage.push({ type: 'text', data: { text: el.data?.text || '' } })
            break
          case 'image':
            milkyMessage.push({
              type: 'image',
              data: {
                file: el.data?.file || el.data?.url,
                url: el.data?.url,
              },
            })
            break
          case 'face':
            milkyMessage.push({ type: 'face', data: { id: String(el.data?.id || 0) } })
            break
          case 'at':
            milkyMessage.push({
              type: 'at',
              data: { qq: el.data?.qq === 'all' ? 'all' : el.data?.qq },
            })
            break
          case 'reply':
            milkyMessage.push({ type: 'reply', data: { id: el.data?.id } })
            break
          case 'record':
            milkyMessage.push({
              type: 'record',
              data: { file: el.data?.file || el.data?.url },
            })
            break
          case 'video':
            milkyMessage.push({
              type: 'video',
              data: { file: el.data?.file || el.data?.url },
            })
            break
          case 'file':
            milkyMessage.push({
              type: 'file',
              data: { file: el.data?.file || el.data?.url },
            })
            break
          case 'json':
            milkyMessage.push({ type: 'json', data: el.data })
            break
          case 'xml':
            milkyMessage.push({ type: 'xml', data: { data: el.data?.data } })
            break
          case 'markdown':
            milkyMessage.push({ type: 'markdown', data: { content: el.data?.content } })
            break
          default:
            // 未知类型，尝试直接传递
            milkyMessage.push(element)
        }
      } else {
        // 其他情况，转换为文本
        milkyMessage.push({ type: 'text', data: { text: String(element) } })
      }
    }

    return milkyMessage
  }
}
