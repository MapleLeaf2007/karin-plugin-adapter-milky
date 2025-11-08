import { MilkyWebSocket } from '../src'

/**
 * WebSocket模式示例
 * 展示如何使用WebSocket客户端连接Milky协议服务器并监听事件
 */
async function main() {
  // 创建WebSocket客户端
  const client = new MilkyWebSocket({
    url: 'ws://localhost:3000/event',
    accessToken: 'your-access-token', // 可选
    autoReconnect: true, // 自动重连
    reconnectInterval: 5000, // 重连间隔(ms)
    maxReconnectAttempts: 10, // 最大重连次数
    timeout: 120000, // API调用超时时间
  })

  // 监听连接事件
  client.on('connected', () => {
    console.log('WebSocket已连接')
  })

  client.on('disconnected', () => {
    console.log('WebSocket连接断开')
  })

  client.on('reconnecting', (attempt: number) => {
    console.log(`正在尝试重连... (第${attempt}次)`)
  })

  client.on('error', (error: Error) => {
    console.error('发生错误:', error)
  })

  // 监听消息接收事件
  client.on('message_receive', (event) => {
    console.log('\n=== 收到消息 ===')
    console.log('消息内容:', event)
    
    // 可以在这里处理收到的消息
    // 例如：自动回复
    // if (event.message_scene === 'friend') {
    //   client.callApi('send_private_message', {
    //     user_id: event.sender_id,
    //     message: [{ type: 'text', data: { text: '收到你的消息了！' } }]
    //   })
    // }
  })

  // 监听好友请求事件
  client.on('friend_request', (event) => {
    console.log('\n=== 收到好友请求 ===')
    console.log('请求信息:', event)
  })

  // 监听群成员增加事件
  client.on('group_member_increase', (event) => {
    console.log('\n=== 群成员增加 ===')
    console.log('事件信息:', event)
  })

  // 监听群消息撤回事件
  client.on('message_recall', (event) => {
    console.log('\n=== 消息被撤回 ===')
    console.log('撤回信息:', event)
  })

  // 监听所有事件（通用事件监听器）
  client.on('event', (event) => {
    console.log('\n=== 收到事件 ===')
    console.log('事件类型:', event.event_type)
    console.log('事件数据:', event)
  })

  try {
    // 初始化连接
    await client.init()
    console.log('WebSocket客户端初始化成功')

    // 等待一段时间以接收事件
    console.log('\n正在监听事件... (按 Ctrl+C 退出)')

    // 示例：发送群消息
    setTimeout(async () => {
      try {
        console.log('\n=== 发送测试消息 ===')
        const result = await client.callApi('send_group_message', {
          group_id: '789012',
          message: [
            { type: 'text', data: { text: 'WebSocket客户端测试消息' } },
          ],
        })
        console.log('消息发送成功:', result)
      } catch (error) {
        console.error('发送消息失败:', error)
      }
    }, 3000)

    // 示例：获取历史消息
    setTimeout(async () => {
      try {
        console.log('\n=== 获取历史消息 ===')
        const messages = await client.callApi('get_history_messages', {
          message_scene: 'group',
          peer_id: '789012',
          limit: 5,
        })
        console.log('历史消息:', messages)
      } catch (error) {
        console.error('获取历史消息失败:', error)
      }
    }, 6000)

    // 保持程序运行
    await new Promise(() => {})
  } catch (error) {
    console.error('初始化失败:', error)
  }
}

// 处理退出信号
process.on('SIGINT', () => {
  console.log('\n正在关闭WebSocket客户端...')
  process.exit(0)
})

main().catch(console.error)
