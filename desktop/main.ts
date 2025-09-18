import { app, BrowserWindow, Menu, shell, dialog } from "electron";
import type { MenuItemConstructorOptions } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === "development";

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: true,
		},
		icon: path.join(__dirname, "assets/icon.png"),
		show: false,
	});

	const startUrl = isDev
		? process.env.ELECTRON_START_URL || "http://localhost:5173"
		: `file://${path.join(__dirname, "../dist-web/index.html")}`;

	mainWindow.loadURL(startUrl);

	mainWindow.once("ready-to-show", () => {
		mainWindow.show();

		if (isDev) {
			mainWindow.webContents.openDevTools();
		}
	});

	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);
		return { action: "deny" };
	});

	const template: MenuItemConstructorOptions[] = [
		{
			label: "File",
			submenu: [
				{
					label: "New",
					accelerator: "CmdOrCtrl+N",
					click: () => {
						mainWindow.webContents.send("menu-new");
					},
				},
				{
					label: "Open",
					accelerator: "CmdOrCtrl+O",
					click: () => {
						mainWindow.webContents.send("menu-open");
					},
				},
				{
					label: "Save",
					accelerator: "CmdOrCtrl+S",
					click: () => {
						mainWindow.webContents.send("menu-save");
					},
				},
				{ type: "separator" },
				{
					label: "Exit",
					accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
					click: () => {
						app.quit();
					},
				},
			],
		},
		{
			label: "Edit",
			submenu: [
				{ label: "Undo", accelerator: "CmdOrCtrl+Z", role: "undo" },
				{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", role: "redo" },
				{ type: "separator" },
				{ label: "Cut", accelerator: "CmdOrCtrl+X", role: "cut" },
				{ label: "Copy", accelerator: "CmdOrCtrl+C", role: "copy" },
				{ label: "Paste", accelerator: "CmdOrCtrl+V", role: "paste" },
			],
		},
		{
			label: "View",
			submenu: [
				{ label: "Reload", accelerator: "CmdOrCtrl+R", role: "reload" },
				{
					label: "Force Reload",
					accelerator: "CmdOrCtrl+Shift+R",
					role: "forceReload",
				},
				{
					label: "Toggle Developer Tools",
					accelerator: "F12",
					role: "toggleDevTools",
				},
				{ type: "separator" },
				{ label: "Actual Size", accelerator: "CmdOrCtrl+0", role: "resetZoom" },
				{ label: "Zoom In", accelerator: "CmdOrCtrl+Plus", role: "zoomIn" },
				{ label: "Zoom Out", accelerator: "CmdOrCtrl+-", role: "zoomOut" },
				{ type: "separator" },
				{
					label: "Toggle Fullscreen",
					accelerator: "F11",
					role: "togglefullscreen",
				},
			],
		},
		{
			label: "Help",
			submenu: [
				{
					label: "About",
					click: () => {
						dialog.showMessageBox(mainWindow, {
							type: "info",
							title: "About",
							message: "React Vite Project",
							detail:
								"AI-powered visual workflow editor with SVG canvas functionality.",
						});
					},
				},
			],
		},
	];

	if (process.platform === "darwin") {
		template.unshift({
			label: app.getName(),
			submenu: [
				{ label: "About", role: "about" },
				{ type: "separator" },
				{ label: "Services", role: "services", submenu: [] },
				{ type: "separator" },
				{ label: "Hide", role: "hide" },
				{ label: "Hide Others", role: "hideOthers" },
				{ label: "Show All", role: "unhide" },
				{ type: "separator" },
				{ label: "Quit", role: "quit" },
			],
		});
	}

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.on("web-contents-created", (event, contents) => {
	contents.on("new-window", (event, navigationUrl) => {
		event.preventDefault();
		shell.openExternal(navigationUrl);
	});
});
