/**
 * Milky事件类型
 */
export const MilkyEventType = {
  /** 机器人离线事件 */
  BOT_OFFLINE: 'bot_offline',
  /** 消息撤回事件 */
  MESSAGE_RECALL: 'message_recall',
  /** 消息接收事件 */
  MESSAGE_RECEIVE: 'message_receive',
  /** 好友请求事件 */
  FRIEND_REQUEST: 'friend_request',
  /** 入群申请事件 */
  GROUP_JOIN_REQUEST: 'group_join_request',
  /** 群成员邀请他人入群事件 */
  GROUP_INVITED_JOIN_REQUEST: 'group_invited_join_request',
  /** 他人邀请自身入群事件 */
  GROUP_INVITATION: 'group_invitation',
  /** 好友戳一戳事件 */
  FRIEND_NUDGE: 'friend_nudge',
  /** 好友文件上传事件 */
  FRIEND_FILE_UPLOAD: 'friend_file_upload',
  /** 群管理员变更事件 */
  GROUP_ADMIN_CHANGE: 'group_admin_change',
  /** 群精华消息变更事件 */
  GROUP_ESSENCE_MESSAGE_CHANGE: 'group_essence_message_change',
  /** 群成员增加事件 */
  GROUP_MEMBER_INCREASE: 'group_member_increase',
  /** 群成员减少事件 */
  GROUP_MEMBER_DECREASE: 'group_member_decrease',
  /** 群名称变更事件 */
  GROUP_NAME_CHANGE: 'group_name_change',
  /** 群消息表情回应事件 */
  GROUP_MESSAGE_REACTION: 'group_message_reaction',
} as const

export type MilkyEventTypeKeys = keyof typeof MilkyEventType
export type MilkyEventTypeValues = typeof MilkyEventType[MilkyEventTypeKeys]
