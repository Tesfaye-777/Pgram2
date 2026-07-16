import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const url = "http://localhost:3000";
const rootCandidates = [
  process.cwd(),
  path.dirname(process.argv[0] ?? ""),
  path.dirname(process.execPath),
];
const projectRoot = rootCandidates.find((candidate) =>
  existsSync(path.join(candidate, "package.json")),
);

function isServerReady(): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port: 3000 });
    const finish = (ready: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(ready);
    };

    socket.setTimeout(700);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

function openBrowser() {
  const browser = spawn("cmd.exe", ["/c", "start", "", url], {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });
  browser.unref();
}

async function waitForServer() {
  for (let attempt = 0; attempt < 48; attempt += 1) {
    if (await isServerReady()) {
      openBrowser();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.error("命书未能在 12 秒内启动。请确认项目依赖已安装，并检查 Bun 是否可用。");
}

async function launch() {
  if (!projectRoot) {
    console.error("找不到项目目录。请把命书启动器.exe 放在项目根目录后再运行。");
    return;
  }

  if (await isServerReady()) {
    openBrowser();
    return;
  }

  const server = spawn("bun", ["run", "dev"], {
    cwd: projectRoot,
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });

  server.unref();
  await waitForServer();
}

void launch();
