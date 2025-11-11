import { AdapterMilky } from '@/core/bot'
import { IncomingMessage } from '@saltify/milky-types'
import {
  contactFriend,
  contactGroup,
  contactGroupTemp,
  createFriendMessage,
  createGroupMessage,
  createGroupTempMessage,
  logger,
  senderFriend,
  senderGroup,
  senderGroupTemp
} from 'node-karin'
import { AdapterConvertKarin } from './convert'
import { AdapterName } from '@/utils'

export const createMessage = async (event: IncomingMessage, bot: AdapterMilky) => {
  const time = event.time
  const elements = await AdapterConvertKarin(event.segments)
  const messageId = bot.super.serializeMsgId(event.message_scene, event.peer_id, event.message_seq)
  const userId = String(event.sender_id)
  if (event.message_scene === 'friend') {
    const nickname = event.friend.nickname
    const contact = contactFriend(userId, nickname)
    const sender = senderFriend(userId, nickname, event.friend.sex)
    createFriendMessage({
      time,
      eventId: `message:${messageId}`,
      rawEvent: event,
      srcReply: (elements) => bot.sendMsg(contact, elements),
      bot,
      messageId,
      messageSeq: event.message_seq,
      elements,
      contact,
      sender,
    })
  }
  if (event.message_scene === 'group') {
    const groupId = String(event.group.group_id)
    const groupName = event.group.group_name
    const contact = contactGroup(groupId, groupName)
    const sender = senderGroup(userId, event.group_member.role, event.group_member.nickname, event.group_member.sex, 0, event.group_member.card, '', event.group_member.level, event.group_member.title)
    createGroupMessage({
      time,
      eventId: `message:${messageId}`,
      rawEvent: event,
      srcReply: (elements) => bot.sendMsg(contact, elements),
      bot,
      messageId,
      messageSeq: event.message_seq,
      elements,
      contact,
      sender,
    })
  }
  if (event.message_scene === 'temp') {
    const contact = contactGroupTemp(String(event.group?.group_id), userId, event.group?.group_name)
    const sender = senderGroupTemp(userId)
    createGroupTempMessage({
      time,
      eventId: `message:${messageId}`,
      rawEvent: event,
      srcReply: (elements) => bot.sendMsg(contact, elements),
      bot,
      messageId,
      messageSeq: event.message_seq,
      elements,
      contact,
      sender,
    })
  }
  logger.warn(`[${AdapterName}] 收到未知事件: ${JSON.stringify(event)}`)
  return true
}
