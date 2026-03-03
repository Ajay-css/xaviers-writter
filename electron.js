import { app, BrowserWindow, Menu, session, shell } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createMenu() {
  const template = [
    {
      label: "Xaviers Writer",
      submenu: [
        { label: "About Xaviers Writer", role: "about" },
        { type: "separator" },
        { label: "Preferences...", accelerator: "CmdOrCtrl+,", click: () => { } },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "File",
      submenu: [
        {
          label: "New Document",
          accelerator: "CmdOrCtrl+N",
          click: () => mainWindow.webContents.send("new-document"),
        },
        {
          label: "Open...",
          accelerator: "CmdOrCtrl+O",
          click: () => mainWindow.webContents.send("open-document"),
        },
        { type: "separator" },
        {
          label: "Save",
          accelerator: "CmdOrCtrl+S",
          click: () => mainWindow.webContents.send("save-document"),
        },
        { type: "separator" },
        { label: "Print", accelerator: "CmdOrCtrl+P", click: () => mainWindow.webContents.print() }
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Learn More",
          click: async () => {
            await shell.openExternal("https://xaviers.writer.vercel.app");
          }
        },
        {
          label: "Developer Tools",
          accelerator: "F12",
          click: () => mainWindow.webContents.openDevTools(),
        }
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    // Standard native frame — works on Windows, macOS and Linux
    frame: true,
    backgroundColor: "#ffffff",
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // Load URL — try dev server first, fallback to built dist files
  const distPath = path.join(__dirname, "client/dist/index.html");

  if (app.isPackaged) {
    mainWindow.loadFile(distPath);
  } else {
    // In development, try the Vite dev server first
    mainWindow.loadURL("http://localhost:5173").catch(() => {
      console.log("Dev server not running. Loading from built files (client/dist)...");
      mainWindow.loadFile(distPath);
    });
  }

  // Prevent white flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Handle external links safely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  createMenu();
}

app.whenReady().then(() => {
  app.setAppUserModelId("com.xaviers.writer");

  // CSP — allows Google Fonts, Unsplash images, and inline styles
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src 'self' https://images.unsplash.com https://*.unsplash.com data: blob:",
            "connect-src 'self' http://localhost:* ws://localhost:* https://*",
            "media-src 'self' blob:",
          ].join("; "),
        ],
      },
    });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
