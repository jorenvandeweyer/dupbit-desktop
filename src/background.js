'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

import createTray from './electron/tray.js';
import Websocket from './websocket';

// eslint-disable-next-line no-unused-vars
let win, tray, ws;

protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
        }
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        // if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app');
        win.loadURL('app://./index.html');
    }

    win.on('closed', () => {
        win = null;
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installVueDevtools()
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }

    ws = new Websocket({
        auth: true,
        ws_host: 'http://localhost:8080',
        token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MDg2MjMyMTIsImlhdCI6MTU5MzI2MzIxMiwianRpIjoyNywidG9lIjoxNTkzMzQ4NDQ5LCJjcmVhdGVkQXQiOiIyMDIwLTA2LTI3VDEzOjA2OjUyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTA2LTI4VDEyOjQ2OjI5LjYyN1oiLCJ1aWQiOjEsInVwbSI6MX0.iALLJh6mcRLD2eGFaznu7UvHYJERm7hNv-WITSlg0D8YLjS01pJd_N9OrtI8CaKxpHa69Ats1EHcreM-V6tBvHFBbSJTzXbBN9B_87fLEq9H3hXx2CzrmiuKIfBKxjHr3tbWv7LK_zZtYahCe903CQt2VrND3QY2cDl73humnNVn6W-WeV4ih9hlsboUe4c5PNGZT6H3vvz7G9gcRoLjWuqtDTbPDsaUqvoCacIRZ8SHbjjd9WEQeFYliNb8LJo7KKu8yIZEPbjzumEuenMSo6MOFwaA-VGEnRlbjALGwQZhzwwEqHR0Yk2QsnB2wgK6kAcPU1JxtAII0J4gBNj1Iw',
    });

    tray = createTray();

    createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
