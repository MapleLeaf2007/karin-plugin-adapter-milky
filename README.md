# Karin Milky 适配器

基于 [Milky 协议](https://milky.ntqqrev.org/) 的 Karin 适配器插件实现。

## 📖 目录

- [简介](#简介)
- [安装](#安装)
- [快速开始](#快速开始)
- [配置说明](#配置说明)
- [开发](#开发)

---

## 简介

本插件是 Karin 的 Milky 协议适配器，使 Karin 能够连接到支持 Milky 协议的 QQ 机器人后端
---

## 安装

在 Karin 项目根目录下执行：

```bash
pnpm add @karinjs/plugin-adapter-milky -w
```

## 使用说明

### 第一次使用

1. **安装插件**（见上方安装命令）

2. **启动 Karin**
   首次启动时，插件会自动创建配置文件：
   - 配置目录：`@karinjs/@karinjs/plugin-adapter-milky/config/`
   - 配置文件：`config.json`

3. **修改配置**
   找到并编辑配置文件：

```json
{
  "webhookToken": "Fvuo0TRH", // 暂时不支持
  "bots": [
    {
      "protocol": "websocket", //通讯协议支持websocket webhook sse
      "url": "https://example.com", // 协议端地址
      "token": "abcd" // 协议端密钥，将用于API请求跟websocket sse事件连接使用
    }
  ]
}
```

4. **重启 Karin**
   配置修改后重启，适配器会自动连接并注册 Bot

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

```

---

## 参考资料

- [Milky 协议文档](https://milky.ntqqrev.org/)
- [Milky GitHub](https://github.com/SaltifyDev/milky)
- [Karin 文档](https://github.com/KarinJS/Karin)
- [Karin OneBot 适配器](https://github.com/KarinJS/Karin/tree/main/packages/onebot)

---

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

GPL-3.0 License
