import type { MilkyMessageApi } from './message'
import type { MilkyFriendApi } from './friend'
import type { MilkyGroupApi } from './group'

export * from './message'
export * from './friend'
export * from './group'

/**
 * Milky完整API接口
 */
export interface MilkyApi extends MilkyMessageApi, MilkyFriendApi, MilkyGroupApi {}

/**
 * API响应类型
 */
export type ApiResponse<T = unknown> =
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
