import { logger } from 'node-karin'
import { Root } from './utils/Root'
import { config } from './utils/config'
import { createMilkyWebSocket, createMilkyHttp } from './adapter'
import { milkyRouter } from './router'

// 导出适配器
export * from './adapter'

// 导出原始连接类（可选）
export * from './core'
export * from './api'
export * from './event'
export * from './connection'

// 导出配置和工具
export * from './utils'

// 导出路由
export * from './router'

/** 适配器加载日志 */
logger.info(`[${Root.pluginName}] 适配器 v${Root.pluginVersion} 加载完成~`)

/**
 * 自动加载配置并初始化适配器
 */
const initAdapters = async () => {
  try {
    const cfg = config()

    // 初始化 WebSocket 适配器
    if (cfg.websocket.enable) {
      logger.info('[Milky] 正在初始化 WebSocket 适配器...')
      await createMilkyWebSocket({
        url: cfg.websocket.url,
        accessToken: cfg.websocket.accessToken || undefined,
        autoReconnect: cfg.websocket.autoReconnect ?? true,
        reconnectInterval: cfg.websocket.reconnectInterval ?? 5000,
        maxReconnectAttempts: cfg.websocket.maxReconnectAttempts ?? 10,
        timeout: cfg.websocket.timeout ?? 120000,
      })
    }

    // 初始化 HTTP 适配器
    if (cfg.http.enable) {
      logger.info('[Milky] 正在初始化 HTTP 适配器...')
      await createMilkyHttp({
        baseUrl: cfg.http.baseUrl,
        accessToken: cfg.http.accessToken || undefined,
        timeout: cfg.http.timeout ?? 120000,
      })
    }

    if (!cfg.websocket.enable && !cfg.http.enable) {
      logger.warn('[Milky] 未启用任何适配器，请检查配置文件')
    }
  } catch (error) {
    logger.error('[Milky] 适配器初始化失败:', error)
  }
}

// 延迟初始化，确保 Karin 完全加载
setTimeout(() => {
  initAdapters().catch(err => {
    logger.error('[Milky] 适配器初始化异常:', err)
  })
  
  // 注意：路由设置需要访问 Karin 的 app 实例
  // 如果 Karin 提供了全局 app 访问方式，可以在这里设置路由
  // 例如: milkyRouter.setup(global.karinApp)
  logger.info('[Milky Router] 路由功能已就绪，可通过 milkyRouter.setup(app) 手动设置')
}, 1000)

