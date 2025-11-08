import { logger } from 'node-karin'
import { Root } from './utils/Root'

export * from './core'
export * from './api'
export * from './event'
export * from './connection'

/** 请不要在这编写插件 不会有任何效果~ */
logger.info(`[${Root.pluginName}] 适配器 v${Root.pluginVersion} 加载完成~`)
