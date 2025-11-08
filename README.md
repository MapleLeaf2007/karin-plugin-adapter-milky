# Karin Milky 适配器

基于 [Milky 协议](https://milky.ntqqrev.org/) 的 Karin 适配器实现。

## 📖 目录

- [简介](#简介)
- [安装](#安装)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
- [事件系统](#事件系统)
- [开发](#开发)
- [贡献](#贡献)

---

## 简介

Milky 是新一代 QQ 机器人应用接口标准，本项目为 Karin 提供 Milky 协议的适配器实现。

**特性：**
- ✅ 支持 HTTP 和 WebSocket 连接
- ✅ 完整的消息 API
- ✅ 好友和群组管理 API
- ✅ 事件监听和处理
- ✅ TypeScript 类型支持
- ✅ 自动重连（WebSocket）

---

## 安装

在 Karin 项目根目录下执行：

```bash
pnpm add karin-plugin-adapter-milky -w
```

---

## 快速开始

### HTTP 模式

```typescript
import { MilkyHttp } from 'karin-plugin-adapter-milky'

const client = new MilkyHttp({
  baseUrl: 'http://localhost:3000',
  accessToken: 'your-access-token', // 可选
  timeout: 120000, // 可选，默认 120 秒
})

await client.init()

// 发送消息
const result = await client.callApi('send_private_message', {
  user_id: '123456',
  message: [{ type: 'text', data: { text: 'Hello!' } }]
})
```

### WebSocket 模式

```typescript
import { MilkyWebSocket } from 'karin-plugin-adapter-milky'

const client = new MilkyWebSocket({
  url: 'ws://localhost:3000/event',
  accessToken: 'your-access-token', // 可选
  autoReconnect: true, // 自动重连，默认 true
  reconnectInterval: 5000, // 重连间隔(ms)，默认 5000
  maxReconnectAttempts: 10, // 最大重连次数，默认 10
})

// 监听事件
client.on('message_receive', (event) => {
  console.log('收到消息:', event)
})

await client.init()

// 调用 API
const result = await client.callApi('send_group_message', {
  group_id: '789012',
  message: [{ type: 'text', data: { text: 'Hello, group!' } }]
})
```

---

## API 文档

### 消息 API

- `send_private_message` - 发送私聊消息
- `send_group_message` - 发送群消息
- `recall_private_message` - 撤回私聊消息
- `recall_group_message` - 撤回群消息
- `get_message` - 获取消息
- `get_history_messages` - 获取历史消息
- `get_resource_temp_url` - 获取资源临时链接
- `get_forwarded_messages` - 获取转发消息
- `mark_message_as_read` - 标记消息为已读

### 好友 API

- `send_friend_nudge` - 发送好友戳一戳
- `send_profile_like` - 发送资料点赞
- `get_friend_requests` - 获取好友请求列表
- `accept_friend_request` - 接受好友请求
- `reject_friend_request` - 拒绝好友请求

### 群组 API

- `set_group_name` - 设置群名称
- `set_group_avatar` - 设置群头像
- `set_group_member_card` - 设置群成员名片
- `set_group_member_special_title` - 设置群成员专属头衔
- `set_group_member_admin` - 设置群管理员
- `set_group_member_mute` - 设置群成员禁言
- `set_group_whole_mute` - 设置全员禁言
- `kick_group_member` - 踢出群成员
- `get_group_announcements` - 获取群公告列表
- `send_group_announcement` - 发送群公告
- `delete_group_announcement` - 删除群公告
- `get_group_essence_messages` - 获取群精华消息列表
- `set_group_essence_message` - 设置精华消息
- `quit_group` - 退出群聊
- `send_group_message_reaction` - 发送群消息表情回应
- `send_group_nudge` - 发送群戳一戳

---

## 事件系统

支持的事件类型：

- `message_receive` - 消息接收
- `bot_offline` - 机器人离线
- `message_recall` - 消息撤回
- `friend_request` - 好友请求
- `group_join_request` - 入群申请
- `group_invited_join_request` - 群成员邀请他人入群
- `group_invitation` - 他人邀请自身入群
- `friend_nudge` - 好友戳一戳
- `friend_file_upload` - 好友文件上传
- `group_admin_change` - 群管理员变更
- `group_essence_message_change` - 群精华消息变更
- `group_member_increase` - 群成员增加
- `group_member_decrease` - 群成员减少
- `group_name_change` - 群名称变更
- `group_message_reaction` - 群消息表情回应

WebSocket 连接事件：

- `connected` - 连接成功
- `disconnected` - 连接断开
- `reconnecting` - 正在重连
- `error` - 发生错误
- `event` - 任意事件（通用）

---

## 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/KarinJS/karin-plugin-adapter-milky.git
cd karin-plugin-adapter-milky

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
npx tsc --noEmit
```

### 项目结构

```
src/
├── core/          # 核心基类
├── api/           # API 接口定义
├── event/         # 事件类型定义
├── connection/    # 连接层（HTTP/WebSocket）
├── utils/         # 工具函数
└── index.ts       # 入口文件
```

---

## 贡献

欢迎提交 Issue 和 Pull Request！

- [GitHub Issues](https://github.com/KarinJS/karin-plugin-adapter-milky/issues)
- [Milky 协议文档](https://milky.ntqqrev.org/)
- [Karin 文档](https://github.com/KarinJS/Karin)

## 许可证

GPL-3.0 License
