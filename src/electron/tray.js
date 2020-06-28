import { app, Menu, Tray } from 'electron';

const isMac = process.platform === 'darwin'

function createTray() {
    let trayImage;

    if (isMac) {
        trayImage = __static + "/img/macos/iconTemplate.png";
    } else {
        trayImage = __static + "/img/win/tray.png";
    }

    const tray = new Tray(trayImage);

    const contextMenu = createContextMenu();
    tray.setContextMenu(contextMenu)

    return tray;
}

function createContextMenu() {
    return Menu.buildFromTemplate([
        {
            id: "reconnecting",
            label: "Reconnecting...",
            visible: true,
            enabled: false,
        },
        {
            id: "connect",
            label: "Connect",
            visible: false,
            click: () => {
                handler.reconnect();
            }
        },
        {
            id: "disconnect",
            label: "Disconnect",
            visible: false,
            click: () => {
                handler.disconnect();
            }
        },
        { type: 'separator' },
        {
            id: "signin",
            label: "Sign In",
            click: () => {
                // handler.sendFrontend("screen", {
                //     screen: "login",
                //     data: {
                //         isLoggedIn: false,
                //     }
                // });
                openWindow();
            }
        },
        {
            id: "signout",
            label: "Sign Out",
            visible: false,
            click: () => {
                handler.logout();
            }
        },
        { type: 'separator' },
        {
            ud: "settings",
            label: "Settings",
            submenu: [
                {
                    id: "startonlogin",
                    label: "Start on log in",
                    type: "checkbox",
                    checked: app.getLoginItemSettings().openAtLogin,
                    click: () => {
                        const boot = app.getLoginItemSettings().openAtLogin;
                        if (boot && platform === "darwin") {
                            exec(`osascript -e 'tell application "System Events" to delete login item "Dupbit"'`);
                        }
                        app.setLoginItemSettings({
                            openAtLogin: !boot,
                        });
                    }
                },
                {
                    id: "opensettings",
                    label: "Open settings",
                    type: "normal",
                    click: () => {
                        handler.sendFrontend("screen", {
                            screen: "settings"
                        });
                        openWindow();
                    }
                },
                { type: "separator" },
                {
                    id: "checkforupdate",
                    label: "Check for update",
                    type: "normal",
                    click: () => {
                        autoUpdater.checkForUpdatesAndNotify();
                    }
                },
                { type: "separator" },
                {
                    id: "debug",
                    label: "Debug",
                    type: "checkbox",
                    checked: global && global.settings && global.settings.get("debug"),
                    click: function() {
                        if(global && global.settings) {
                            const debug = global && global.settings && global.settings.get("debug");
                            global.settings.set('debug', !debug);
                            contextMenu.getMenuItemById("debug").checked = global && global.settings && global.settings.get("debug");
                        }
                    }
                }
            ],
        },
        { type: 'separator' },
        {
            id: "show",
            label: "Show App",
            click: () => {
                openWindow();
            }
        },
        {
            id: "quit",
            label: "Quit",
            click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
}

export default createTray;

