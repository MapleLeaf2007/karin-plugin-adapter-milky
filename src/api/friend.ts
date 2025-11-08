import type {
  SendFriendNudgeInput,
  SendProfileLikeInput,
  GetFriendRequestsInput,
  GetFriendRequestsOutput,
  AcceptFriendRequestInput,
  RejectFriendRequestInput,
} from '@saltify/milky-types'

/**
 * Milky好友API接口
 */
export interface MilkyFriendApi {
  /**
   * 发送好友戳一戳
   */
  send_friend_nudge: (params: SendFriendNudgeInput) => Promise<void>

  /**
   * 发送资料点赞
   */
  send_profile_like: (params: SendProfileLikeInput) => Promise<void>

  /**
   * 获取好友请求列表
   */
  get_friend_requests: (params: GetFriendRequestsInput) => Promise<GetFriendRequestsOutput>

  /**
   * 接受好友请求
   */
  accept_friend_request: (params: AcceptFriendRequestInput) => Promise<void>

  /**
   * 拒绝好友请求
   */
  reject_friend_request: (params: RejectFriendRequestInput) => Promise<void>
}

export type {
  SendFriendNudgeInput,
  SendProfileLikeInput,
  GetFriendRequestsInput,
  GetFriendRequestsOutput,
  AcceptFriendRequestInput,
  RejectFriendRequestInput,
}
