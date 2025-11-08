import type {
  SendPrivateMessageInput,
  SendPrivateMessageOutput,
  SendGroupMessageInput,
  SendGroupMessageOutput,
  RecallPrivateMessageInput,
  RecallGroupMessageInput,
  GetMessageInput,
  GetMessageOutput,
  GetHistoryMessagesInput,
  GetHistoryMessagesOutput,
  GetResourceTempUrlInput,
  GetResourceTempUrlOutput,
  GetForwardedMessagesInput,
  GetForwardedMessagesOutput,
  MarkMessageAsReadInput,
} from '@saltify/milky-types'

/**
 * Milky消息API接口
 */
export interface MilkyMessageApi {
  /**
   * 发送私聊消息
   */
  send_private_message: (params: SendPrivateMessageInput) => Promise<SendPrivateMessageOutput>

  /**
   * 发送群消息
   */
  send_group_message: (params: SendGroupMessageInput) => Promise<SendGroupMessageOutput>

  /**
   * 撤回私聊消息
   */
  recall_private_message: (params: RecallPrivateMessageInput) => Promise<void>

  /**
   * 撤回群消息
   */
  recall_group_message: (params: RecallGroupMessageInput) => Promise<void>

  /**
   * 获取消息
   */
  get_message: (params: GetMessageInput) => Promise<GetMessageOutput>

  /**
   * 获取历史消息
   */
  get_history_messages: (params: GetHistoryMessagesInput) => Promise<GetHistoryMessagesOutput>

  /**
   * 获取资源临时链接
   */
  get_resource_temp_url: (params: GetResourceTempUrlInput) => Promise<GetResourceTempUrlOutput>

  /**
   * 获取转发消息
   */
  get_forwarded_messages: (params: GetForwardedMessagesInput) => Promise<GetForwardedMessagesOutput>

  /**
   * 标记消息为已读
   */
  mark_message_as_read: (params: MarkMessageAsReadInput) => Promise<void>
}

export type {
  SendPrivateMessageInput,
  SendPrivateMessageOutput,
  SendGroupMessageInput,
  SendGroupMessageOutput,
  RecallPrivateMessageInput,
  RecallGroupMessageInput,
  GetMessageInput,
  GetMessageOutput,
  GetHistoryMessagesInput,
  GetHistoryMessagesOutput,
  GetResourceTempUrlInput,
  GetResourceTempUrlOutput,
  GetForwardedMessagesInput,
  GetForwardedMessagesOutput,
  MarkMessageAsReadInput,
}
