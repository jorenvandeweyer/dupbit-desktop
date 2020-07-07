import { app, protocol, BrowserWindow } from 'electron';
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
]);

import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import createTray from './electron/tray.js';
import Core from './electron/core';

const isDev = process.env.NODE_ENV !== 'production';

global.store = {
    auth: null,
    token: null,
    api_host: isDev ? 'http://localhost:8080' : 'https://api.dupbit.com',
};

const core = new Core(global.store);

core.on('open-window', () => {
    if (core.win) {
        core.win.show();
    } else {
        createWindow();
    }
});

function createWindow() {
    core.win = new BrowserWindow({
        width: 800,
        height: 600,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
        }
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        core.win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    } else {
        createProtocol('app');
        core.win.loadURL('app://./index.html');
    }

    core.win.on('closed', () => {
        core.win = null;
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (core.win === null) {
        createWindow();
    }
});

app.on('ready', async () => {
    if (isDev && !process.env.IS_TEST) {
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }

    if (process.platform === "darwin") {
        app.dock.hide();
    }

    core.tray = createTray(core);

    createWindow()
});

if (isDev) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}
