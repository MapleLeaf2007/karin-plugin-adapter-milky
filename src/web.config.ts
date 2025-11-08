/**
 * Web UI 配置
 * 用于在 Karin Web 界面中显示和配置插件
 */
export const webConfig = {
  /** 配置名称 */
  name: 'Milky适配器',
  /** 配置描述 */
  description: 'Milky协议适配器配置',
  /** 配置项 */
  fields: [
    {
      key: 'websocket.enable',
      type: 'switch',
      label: '启用WebSocket模式',
      description: '使用WebSocket连接到Milky服务器（推荐）',
      default: true,
    },
    {
      key: 'websocket.url',
      type: 'text',
      label: 'WebSocket地址',
      description: 'Milky服务器的WebSocket地址',
      default: 'ws://localhost:3000/event',
      visible: (config: any) => config.websocket?.enable,
    },
    {
      key: 'websocket.accessToken',
      type: 'password',
      label: 'WebSocket访问令牌',
      description: '访问令牌（可选）',
      default: '',
      visible: (config: any) => config.websocket?.enable,
    },
    {
      key: 'websocket.autoReconnect',
      type: 'switch',
      label: '自动重连',
      description: '连接断开时自动尝试重连',
      default: true,
      visible: (config: any) => config.websocket?.enable,
    },
    {
      key: 'websocket.reconnectInterval',
      type: 'number',
      label: '重连间隔(ms)',
      description: '自动重连的间隔时间（毫秒）',
      default: 5000,
      min: 1000,
      max: 60000,
      visible: (config: any) => config.websocket?.enable && config.websocket?.autoReconnect,
    },
    {
      key: 'websocket.maxReconnectAttempts',
      type: 'number',
      label: '最大重连次数',
      description: '达到最大次数后停止重连',
      default: 10,
      min: 1,
      max: 100,
      visible: (config: any) => config.websocket?.enable && config.websocket?.autoReconnect,
    },
    {
      key: 'http.enable',
      type: 'switch',
      label: '启用HTTP模式',
      description: '使用HTTP连接到Milky服务器',
      default: false,
    },
    {
      key: 'http.baseUrl',
      type: 'text',
      label: 'HTTP基础URL',
      description: 'Milky服务器的HTTP地址',
      default: 'http://localhost:3000',
      visible: (config: any) => config.http?.enable,
    },
    {
      key: 'http.accessToken',
      type: 'password',
      label: 'HTTP访问令牌',
      description: '访问令牌（可选）',
      default: '',
      visible: (config: any) => config.http?.enable,
    },
  ],
}
