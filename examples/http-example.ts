import { MilkyHttp } from '../src'

/**
 * HTTP模式示例
 * 展示如何使用HTTP客户端连接Milky协议服务器
 */
async function main() {
  // 创建HTTP客户端
  const client = new MilkyHttp({
    baseUrl: 'http://localhost:3000',
    accessToken: 'your-access-token', // 可选
    timeout: 120000, // 可选，默认 120 秒
  })

  // 初始化连接
  await client.init()
  console.log('HTTP客户端已连接')

  try {
    // 示例1: 发送私聊消息
    console.log('\n=== 发送私聊消息 ===')
    const privateMessageResult = await client.callApi('send_private_message', {
      user_id: '123456',
      message: [
        { type: 'text', data: { text: 'Hello! ' } },
        { type: 'text', data: { text: '这是一条测试消息' } },
      ],
    })
    console.log('私聊消息发送成功:', privateMessageResult)

    // 示例2: 发送群消息
    console.log('\n=== 发送群消息 ===')
    const groupMessageResult = await client.callApi('send_group_message', {
      group_id: '789012',
      message: [
        { type: 'text', data: { text: 'Hello, group!' } },
      ],
    })
    console.log('群消息发送成功:', groupMessageResult)

    // 示例3: 获取历史消息
    console.log('\n=== 获取历史消息 ===')
    const historyMessages = await client.callApi('get_history_messages', {
      message_scene: 'group',
      peer_id: '789012',
      limit: 10,
    })
    console.log('获取到历史消息:', historyMessages)

    // 示例4: 设置群名称
    console.log('\n=== 设置群名称 ===')
    await client.callApi('set_group_name', {
      group_id: '789012',
      new_group_name: '新的群名称',
    })
    console.log('群名称设置成功')

    // 示例5: 发送好友戳一戳
    console.log('\n=== 发送好友戳一戳 ===')
    await client.callApi('send_friend_nudge', {
      user_id: '123456',
      is_self: false,
    })
    console.log('戳一戳发送成功')

    // 示例6: 获取好友请求列表
    console.log('\n=== 获取好友请求列表 ===')
    const friendRequests = await client.callApi('get_friend_requests', {
      limit: 20,
      is_filtered: false,
    })
    console.log('好友请求列表:', friendRequests)
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    // 关闭连接
    client.close()
    console.log('\nHTTP客户端已关闭')
  }
}

main().catch(console.error)
