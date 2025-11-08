import { MilkyWebSocket } from '../src'

/**
 * Karin集成示例
 * 展示如何在Karin中使用Milky适配器
 */

// 配置信息（实际使用时应该从配置文件读取）
const config = {
  url: 'ws://localhost:3000/event',
  accessToken: process.env.MILKY_ACCESS_TOKEN || '',
  autoReconnect: true,
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
}

// 创建Milky客户端实例
const milky = new MilkyWebSocket(config)

// 机器人初始化
async function initBot() {
  try {
    // 连接事件监听
    milky.on('connected', () => {
      console.log('[Milky] 适配器已连接')
    })

    milky.on('disconnected', () => {
      console.log('[Milky] 适配器连接断开')
    })

    milky.on('error', (error) => {
      console.error('[Milky] 错误:', error)
    })

    // 初始化连接
    await milky.init()
    console.log('[Milky] 适配器初始化成功')

    // 设置消息处理器
    setupMessageHandlers()
    
    // 设置事件处理器
    setupEventHandlers()

    return milky
  } catch (error) {
    console.error('[Milky] 初始化失败:', error)
    throw error
  }
}

// 设置消息处理器
function setupMessageHandlers() {
  milky.on('message_receive', async (event) => {
    console.log(`[消息] 收到来自 ${event.sender_id} 的消息`)
    
    // 简单的命令处理示例
    const message = event.message
    const textSegments = message.filter((seg: any) => seg.type === 'text')
    const text = textSegments.map((seg: any) => seg.data.text).join('')

    // 示例：响应 /ping 命令
    if (text.trim() === '/ping') {
      const scene = event.message_scene
      const peerId = scene === 'friend' ? event.sender_id : event.group_id

      if (scene === 'friend') {
        await milky.callApi('send_private_message', {
          user_id: peerId,
          message: [{ type: 'text', data: { text: 'pong!' } }],
        })
      } else if (scene === 'group') {
        await milky.callApi('send_group_message', {
          group_id: peerId,
          message: [{ type: 'text', data: { text: 'pong!' } }],
        })
      }
    }

    // 示例：响应 /help 命令
    if (text.trim() === '/help') {
      const helpText = '可用命令:\n/ping - 测试机器人响应\n/help - 显示帮助信息'
      const scene = event.message_scene
      const peerId = scene === 'friend' ? event.sender_id : event.group_id

      if (scene === 'friend') {
        await milky.callApi('send_private_message', {
          user_id: peerId,
          message: [{ type: 'text', data: { text: helpText } }],
        })
      } else if (scene === 'group') {
        await milky.callApi('send_group_message', {
          group_id: peerId,
          message: [{ type: 'text', data: { text: helpText } }],
        })
      }
    }
  })
}

// 设置事件处理器
function setupEventHandlers() {
  // 好友请求处理
  milky.on('friend_request', async (event) => {
    console.log(`[好友请求] 收到来自 ${event.initiator_id} 的好友请求`)
    
    // 可以选择自动同意或根据条件判断
    // await milky.callApi('accept_friend_request', {
    //   initiator_uid: event.initiator_uid,
    //   is_filtered: false,
    // })
  })

  // 群成员增加事件
  milky.on('group_member_increase', async (event) => {
    console.log(`[群成员增加] 群 ${event.group_id} 新增成员 ${event.user_id}`)
    
    // 发送欢迎消息
    await milky.callApi('send_group_message', {
      group_id: event.group_id,
      message: [
        { type: 'text', data: { text: '欢迎新成员！' } },
      ],
    })
  })

  // 群成员减少事件
  milky.on('group_member_decrease', (event) => {
    console.log(`[群成员减少] 群 ${event.group_id} 成员 ${event.user_id} 离开`)
  })

  // 消息撤回事件
  milky.on('message_recall', (event) => {
    console.log(`[消息撤回] ${event.operator_id} 撤回了消息 ${event.message_seq}`)
  })

  // 群管理员变更事件
  milky.on('group_admin_change', (event) => {
    const action = event.is_set ? '设置为' : '取消'
    console.log(`[管理员变更] ${event.user_id} 被${action}管理员`)
  })
}

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n[Milky] 正在关闭适配器...')
  milky.close()
  process.exit(0)
})

// 启动机器人
initBot().catch((error) => {
  console.error('[Milky] 启动失败:', error)
  process.exit(1)
})

export { milky }
