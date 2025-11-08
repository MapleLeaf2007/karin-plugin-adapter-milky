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

// src/index.ts
logger.info(`[${Root.pluginName}] \u9002\u914D\u5668 v${Root.pluginVersion} \u52A0\u8F7D\u5B8C\u6210~`);
