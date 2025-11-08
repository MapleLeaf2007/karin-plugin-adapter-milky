// src/index.ts
import { logger } from "node-karin";

// src/utils/Root.ts
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
var filePath = path.resolve(fileURLToPath(import.meta.url).replace(/\\/g, "/"), "../../..");
if (!fs.existsSync(path.join(filePath, "package.json"))) {
  filePath = path.resolve(fileURLToPath(import.meta.url).replace(/\\/g, "/"), "../..");
}
var pkg = JSON.parse(fs.readFileSync(path.join(filePath, "package.json"), "utf-8"));
var Root = {
  pluginName: pkg.name,
  pluginVersion: pkg.version,
  pluginPath: filePath
};

// src/core/core.ts
import { EventEmitter } from "events";
var MilkyCore = class extends EventEmitter {
  /** 是否主动关闭 */
  _manualClosed = false;
  /** 协议信息 */
  protocol;
  /** 机器人信息 */
  self;
  /** 配置 */
  _options;
  constructor(options) {
    super();
    this.protocol = {
      name: "Milky",
      version: "1.0.0",
      connectTime: Date.now()
    };
    this._options = {
      timeout: options?.timeout || 120 * 1e3
    };
    this.self = {
      id: "0",
      nickname: "",
      avatar: ""
    };
  }
};

// src/event/types.ts
var MilkyEventType = {
  /** 机器人离线事件 */
  BOT_OFFLINE: "bot_offline",
  /** 消息撤回事件 */
  MESSAGE_RECALL: "message_recall",
  /** 消息接收事件 */
  MESSAGE_RECEIVE: "message_receive",
  /** 好友请求事件 */
  FRIEND_REQUEST: "friend_request",
  /** 入群申请事件 */
  GROUP_JOIN_REQUEST: "group_join_request",
  /** 群成员邀请他人入群事件 */
  GROUP_INVITED_JOIN_REQUEST: "group_invited_join_request",
  /** 他人邀请自身入群事件 */
  GROUP_INVITATION: "group_invitation",
  /** 好友戳一戳事件 */
  FRIEND_NUDGE: "friend_nudge",
  /** 好友文件上传事件 */
  FRIEND_FILE_UPLOAD: "friend_file_upload",
  /** 群管理员变更事件 */
  GROUP_ADMIN_CHANGE: "group_admin_change",
  /** 群精华消息变更事件 */
  GROUP_ESSENCE_MESSAGE_CHANGE: "group_essence_message_change",
  /** 群成员增加事件 */
  GROUP_MEMBER_INCREASE: "group_member_increase",
  /** 群成员减少事件 */
  GROUP_MEMBER_DECREASE: "group_member_decrease",
  /** 群名称变更事件 */
  GROUP_NAME_CHANGE: "group_name_change",
  /** 群消息表情回应事件 */
  GROUP_MESSAGE_REACTION: "group_message_reaction"
};

// src/connection/http.ts
var MilkyHttp = class extends MilkyCore {
  baseUrl;
  headers;
  constructor(options) {
    super(options);
    this.baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl.slice(0, -1) : options.baseUrl;
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    if (options.accessToken) {
      this.headers["Authorization"] = `Bearer ${options.accessToken}`;
    }
  }
  /**
   * 调用API
   */
  async callApi(method, params = {}) {
    const url = `${this.baseUrl}/api/${method}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(this._options.timeout)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      if (result.status === "failed") {
        throw new Error(`API\u8C03\u7528\u5931\u8D25 (retcode: ${result.retcode}): ${result.message}`);
      }
      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`\u8C03\u7528API ${method} \u5931\u8D25: ${error.message}`);
      }
      throw error;
    }
  }
  /**
   * 初始化连接
   */
  async init() {
  }
  /**
   * 关闭连接
   */
  close() {
    this._manualClosed = true;
    this.removeAllListeners();
  }
};

// src/connection/websocket.ts
import WebSocket from "ws";
var MilkyWebSocket = class extends MilkyCore {
  ws = null;
  url;
  accessToken;
  autoReconnect;
  reconnectInterval;
  maxReconnectAttempts;
  reconnectAttempts = 0;
  reconnectTimer;
  apiCallbacks = /* @__PURE__ */ new Map();
  callId = 0;
  constructor(options) {
    super(options);
    this.url = options.url;
    this.accessToken = options.accessToken;
    this.autoReconnect = options.autoReconnect ?? true;
    this.reconnectInterval = options.reconnectInterval ?? 5e3;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
  }
  /**
   * 初始化WebSocket连接
   */
  async init() {
    return new Promise((resolve, reject) => {
      try {
        const headers = {};
        if (this.accessToken) {
          headers["Authorization"] = `Bearer ${this.accessToken}`;
        }
        this.ws = new WebSocket(this.url, { headers });
        this.ws.on("open", () => {
          this.reconnectAttempts = 0;
          this.emit("connected");
          resolve();
        });
        this.ws.on("message", (data) => {
          this.handleMessage(data);
        });
        this.ws.on("error", (error) => {
          this.emit("error", error);
          reject(error);
        });
        this.ws.on("close", () => {
          this.handleClose();
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * 处理接收到的消息
   */
  handleMessage(data) {
    try {
      const message = JSON.parse(data.toString());
      if (message.echo !== void 0) {
        this.handleApiResponse(message);
        return;
      }
      if (message.event_type) {
        this.emit(message.event_type, message);
        this.emit("event", message);
      }
    } catch (error) {
      this.emit("error", new Error(`\u89E3\u6790\u6D88\u606F\u5931\u8D25: ${error}`));
    }
  }
  /**
   * 处理API响应
   */
  handleApiResponse(response) {
    const callback = this.apiCallbacks.get(response.echo);
    if (!callback) return;
    clearTimeout(callback.timeout);
    this.apiCallbacks.delete(response.echo);
    if (response.status === "ok") {
      callback.resolve(response.data);
    } else {
      callback.reject(new Error(`API\u8C03\u7528\u5931\u8D25 (retcode: ${response.retcode}): ${response.message}`));
    }
  }
  /**
   * 处理连接关闭
   */
  handleClose() {
    this.emit("disconnected");
    if (this._manualClosed) return;
    if (this.autoReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.emit("reconnecting", this.reconnectAttempts);
      this.reconnectTimer = setTimeout(() => {
        this.init().catch((error) => {
          this.emit("error", error);
        });
      }, this.reconnectInterval);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit("error", new Error("\u8FBE\u5230\u6700\u5927\u91CD\u8FDE\u6B21\u6570"));
    }
  }
  /**
   * 调用API
   */
  async callApi(method, params = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket\u672A\u8FDE\u63A5");
    }
    return new Promise((resolve, reject) => {
      const echo = `${++this.callId}`;
      const message = {
        action: method,
        params,
        echo
      };
      const timeout = setTimeout(() => {
        this.apiCallbacks.delete(echo);
        reject(new Error(`API\u8C03\u7528\u8D85\u65F6: ${method}`));
      }, this._options.timeout);
      this.apiCallbacks.set(echo, {
        resolve,
        reject,
        timeout
      });
      this.ws.send(JSON.stringify(message));
    });
  }
  /**
   * 关闭连接
   */
  close() {
    this._manualClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    for (const callback of this.apiCallbacks.values()) {
      clearTimeout(callback.timeout);
      callback.reject(new Error("\u8FDE\u63A5\u5DF2\u5173\u95ED"));
    }
    this.apiCallbacks.clear();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.removeAllListeners();
  }
};

// src/index.ts
logger.info(`[${Root.pluginName}] \u9002\u914D\u5668 v${Root.pluginVersion} \u52A0\u8F7D\u5B8C\u6210~`);
export {
  MilkyCore,
  MilkyEventType,
  MilkyHttp,
  MilkyWebSocket
};
