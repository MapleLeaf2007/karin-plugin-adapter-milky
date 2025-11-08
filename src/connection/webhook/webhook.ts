import { app, authMiddleware, logger } from 'node-karin'
import express from 'node-karin/express'
import { WebHookHander } from './handler'
import { AdapterName } from '@/utils/other'

const RouterPath = '/milky/api/v1'
const router = express.Router()
router.use(express.json())
router.post('/webhook', authMiddleware, (req, _res) => {
  WebHookHander.handle(req.body)
})
router.get('/webhook', (_req, res) => res.json({
  msg: 'Ciallo~(∠・ω< )⌒☆',
  success: '当你看到这个消息，那么就说明 milky 适配器启动成功!',
  tips: '关于鉴权 Token 共用 Karin 的 HTTP 鉴权Token'
}))

app.use(RouterPath, router)
logger.info(`[${AdapterName}] WebHook启动成功`)
logger.info(`[${AdapterName}] ${logger.yellow('WebHook 访问地址')}: ${logger.green(`http://127.0.0.1:${process.env.HTTP_PORT}${RouterPath}/webhook`)}`)
logger.info(`[${AdapterName}] ${logger.red('HTTP 鉴权密钥共用 Karin 的HTTP 鉴权密钥')}`)
