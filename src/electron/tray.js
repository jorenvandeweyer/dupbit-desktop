import { app, Menu, Tray } from 'electron';

function createTray(core) {
    // eslint-disable-next-line no-undef
    const icon = __static + "/icons/Template.png";
    // const trayImage = __static + "/img/ico/iconTemplate.png";
    // eslint-disable-next-line no-undef
    const iconInverted = __static + "/icons/InvertedTemplate.png";
    // const trayImagePressed = __static + "/img/macos/pressedIconTemplate.png";


    const tray = new Tray(icon);

    const contextMenu = createContextMenu(core);
    tray.setContextMenu(contextMenu);

    const setState = state => {
        const reconnecting = contextMenu.getMenuItemById('reconnecting');
        const connect = contextMenu.getMenuItemById('connect');
        const disconnect = contextMenu.getMenuItemById('disconnect');

        const signin = contextMenu.getMenuItemById('signin');
        const signout = contextMenu.getMenuItemById('signout');

        if (state === 'ws-open' || state === 'ws-close' || state === 'ws-reconnect') {
            disconnect.visible = state === 'ws-open';
            connect.visible = state === 'ws-close';
            reconnecting.visible = state === 'ws-reconnect';

            const image = state === 'ws-open' ? iconInverted : icon

            tray.setImage(image);
            tray.setPressedImage(image);
        }

        if (state === 'signed-in' || state === 'signed-out') {
            signin.visible = state === 'signed-out';
            signout.visible = state === 'signed-in';
            connect.enabled = state === 'signed-in';
        }
    };

    core.on('ws-open', () => setState('ws-open'));
    core.on('ws-close', () => setState('ws-close'));
    core.on('ws-reconnecting', () => setState('ws-reconnecting'));

    core.on('signed-in', () => setState('signed-in'));
    core.on('signed-out', () => setState('signed-out'));

    return tray;
}

function createContextMenu(core) {
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
                core.connect();
            }
        },
        {
            id: "disconnect",
            label: "Disconnect",
            visible: false,
            click: () => {
                core.connect(false);
            }
        },
        { type: 'separator' },
        {
            id: "signin",
            label: "Sign In",
            click: () => {
                core.emit('open-window');
            }
        },
        {
            id: "signout",
            label: "Sign Out",
            visible: false,
            click: () => {
                core.signout();
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
                        app.setLoginItemSettings({
                            openAtLogin: !app.getLoginItemSettings().openAtLogin,
                        });
                    }
                },
            ],
        },
        { type: 'separator' },
        {
            id: "show",
            label: "Show App",
            click: () => {
                core.emit('open-window');
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

