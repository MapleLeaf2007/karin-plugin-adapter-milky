import type {
  SetGroupNameInput,
  SetGroupAvatarInput,
  SetGroupMemberCardInput,
  SetGroupMemberSpecialTitleInput,
  SetGroupMemberAdminInput,
  SetGroupMemberMuteInput,
  SetGroupWholeMuteInput,
  KickGroupMemberInput,
  GetGroupAnnouncementsInput,
  GetGroupAnnouncementsOutput,
  SendGroupAnnouncementInput,
  DeleteGroupAnnouncementInput,
  GetGroupEssenceMessagesInput,
  GetGroupEssenceMessagesOutput,
  SetGroupEssenceMessageInput,
  QuitGroupInput,
  SendGroupMessageReactionInput,
  SendGroupNudgeInput,
} from '@saltify/milky-types'

/**
 * Milky群组API接口
 */
export interface MilkyGroupApi {
  /**
   * 设置群名称
   */
  set_group_name: (params: SetGroupNameInput) => Promise<void>

  /**
   * 设置群头像
   */
  set_group_avatar: (params: SetGroupAvatarInput) => Promise<void>

  /**
   * 设置群成员名片
   */
  set_group_member_card: (params: SetGroupMemberCardInput) => Promise<void>

  /**
   * 设置群成员专属头衔
   */
  set_group_member_special_title: (params: SetGroupMemberSpecialTitleInput) => Promise<void>

  /**
   * 设置群管理员
   */
  set_group_member_admin: (params: SetGroupMemberAdminInput) => Promise<void>

  /**
   * 设置群成员禁言
   */
  set_group_member_mute: (params: SetGroupMemberMuteInput) => Promise<void>

  /**
   * 设置全员禁言
   */
  set_group_whole_mute: (params: SetGroupWholeMuteInput) => Promise<void>

  /**
   * 踢出群成员
   */
  kick_group_member: (params: KickGroupMemberInput) => Promise<void>

  /**
   * 获取群公告列表
   */
  get_group_announcements: (params: GetGroupAnnouncementsInput) => Promise<GetGroupAnnouncementsOutput>

  /**
   * 发送群公告
   */
  send_group_announcement: (params: SendGroupAnnouncementInput) => Promise<void>

  /**
   * 删除群公告
   */
  delete_group_announcement: (params: DeleteGroupAnnouncementInput) => Promise<void>

  /**
   * 获取群精华消息列表
   */
  get_group_essence_messages: (params: GetGroupEssenceMessagesInput) => Promise<GetGroupEssenceMessagesOutput>

  /**
   * 设置精华消息
   */
  set_group_essence_message: (params: SetGroupEssenceMessageInput) => Promise<void>

  /**
   * 退出群聊
   */
  quit_group: (params: QuitGroupInput) => Promise<void>

  /**
   * 发送群消息表情回应
   */
  send_group_message_reaction: (params: SendGroupMessageReactionInput) => Promise<void>

  /**
   * 发送群戳一戳
   */
  send_group_nudge: (params: SendGroupNudgeInput) => Promise<void>
}

export type {
  SetGroupNameInput,
  SetGroupAvatarInput,
  SetGroupMemberCardInput,
  SetGroupMemberSpecialTitleInput,
  SetGroupMemberAdminInput,
  SetGroupMemberMuteInput,
  SetGroupWholeMuteInput,
  KickGroupMemberInput,
  GetGroupAnnouncementsInput,
  GetGroupAnnouncementsOutput,
  SendGroupAnnouncementInput,
  DeleteGroupAnnouncementInput,
  GetGroupEssenceMessagesInput,
  GetGroupEssenceMessagesOutput,
  SetGroupEssenceMessageInput,
  QuitGroupInput,
  SendGroupMessageReactionInput,
  SendGroupNudgeInput,
}
