import {
  logger,
  segment,
  createFriendMessage,
  createGroupMessage,
  contactFriend,
  contactGroup,
  senderFriend,
  senderGroup,
} from 'node-karin'
import type { AdapterMilky } from './adapter'
import type { Elements } from 'node-karin'

/**
 * 将Milky消息格式转换为Karin Element
 */
function milkyToKarinElements (milkyMessage: any[]): Elements[] {
  const elements: Elements[] = []

  for (const seg of milkyMessage) {
    switch (seg.type) {
      case 'text':
        elements.push(segment.text(seg.data.text || ''))
        break
      case 'image':
        elements.push(segment.image(seg.data.file || seg.data.url || ''))
        break
      case 'face':
        elements.push(segment.face(Number(seg.data.id) || 0))
        break
      case 'at':
        if (seg.data.qq === 'all') {
          elements.push(segment.at('all'))
        } else {
          elements.push(segment.at(String(seg.data.qq)))
        }
        break
      case 'reply':
        elements.push(segment.reply(String(seg.data.id || seg.data.message_id)))
        break
      case 'record':
        elements.push(segment.record(seg.data.file || seg.data.url || ''))
        break
      case 'video':
        elements.push(segment.video(seg.data.file || seg.data.url || ''))
        break
      case 'file':
        elements.push(segment.file(seg.data.file || seg.data.url || ''))
        break
      case 'json':
        elements.push(segment.json(seg.data))
        break
      case 'xml':
        elements.push(segment.xml(seg.data.data || ''))
        break
      case 'markdown':
        elements.push(segment.markdown(seg.data.content || ''))
        break
      default:
        // 未知类型，记录日志
        logger.warn(`[Milky] 未知的消息类型: ${seg.type}`)
        // 尝试作为文本处理
        if (seg.data?.text) {
          elements.push(segment.text(seg.data.text))
        }
    }
  }

  return elements
}

/**
 * 将Milky消息事件转换为Karin事件
 */
export function createMessage (data: any, adapter: AdapterMilky) {
  try {
    // eslint-disable-next-line camelcase
    const { message_scene, sender_id, message, message_seq, time, group_id } = data

    // 转换消息元素
    const elements = milkyToKarinElements(message || [])

    const messageId = String(message_seq)
    // eslint-disable-next-line camelcase
    const eventId = `message:${message_seq}`
    const timestamp = Number(time) || Date.now()

    // 私聊消息
    // eslint-disable-next-line camelcase
    if (message_scene === 'friend') {
      const userId = String(sender_id)
      const contact = contactFriend(userId)
      const sender = senderFriend(
        userId,
        data.sender_name || userId, // 昵称
        'unknown', // 性别
        0 // 年龄
      )

      createFriendMessage({
        bot: adapter,
        time: timestamp,
        contact,
        sender,
        rawEvent: data,
        messageId,

        messageSeq: Number(message_seq),
        eventId,
        elements,
        srcReply: (elements) => adapter.sendMsg(contact, elements),
      })
      return
    }

    // 群聊消息
    // eslint-disable-next-line camelcase
    if (message_scene === 'group') {
      const groupIdStr = String(group_id)

      const userId = String(sender_id)
      const contact = contactGroup(groupIdStr)
      const sender = senderGroup({
        userId,
        role: data.sender_role || 'member',
        nick: data.sender_name || userId,
        name: data.sender_name || userId,
        card: data.sender_card || '',
        sex: 'unknown',
        age: 0,
      })

      createGroupMessage({
        bot: adapter,
        time: timestamp,
        contact,
        sender,
        rawEvent: data,
        messageId,

        messageSeq: Number(message_seq),
        eventId,
        elements,
        srcReply: (elements) => adapter.sendMsg(contact, elements),
      })
      return
    }

    // eslint-disable-next-line camelcase
    logger.warn(`[Milky] 未知的消息场景: ${message_scene}`, data)
  } catch (error) {
    logger.error('[Milky] 消息事件转换失败:', error, data)
  }
}
