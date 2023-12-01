const { app, BrowserWindow } = require("electron");
const { join } = require("path");
const { format } = require("url");
// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    useContentSize: true,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  win.maximize();
  // development模式
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    // 开启调试台
    // win.webContents.openDevTools()
  } else {
    win.setMenu(null);
    win.loadFile(join(__dirname, "../dist/index.html"));
  }
};
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    log("certificate-error");
    //允许私有证书
    event.preventDefault();
    callback(true);
  }
);
// 忽略证书相关错误
app.commandLine.appendSwitch("ignore-certificate-errors");
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
