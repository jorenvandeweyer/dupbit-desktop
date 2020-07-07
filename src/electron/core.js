import EventEmitter from 'events';
import keytar from 'keytar';
import axios from 'axios';
import Websocket from '../websocket';

import { ipcMain } from 'electron';

class Core extends EventEmitter {
    constructor (store) {
        super();

        //prevent garbage collection
        this.tray = null;
        this.win = null;

        this.store = store;
        this.ws = null;

        this.setup();
    }

    async setup() {
        await this.validateToken();

        this.ws = new Websocket(this.store);

        this.ws.on('close', () => this.emit('ws-close'));
        this.ws.on('open', () => this.emit('ws-open'));
        this.ws.on('reconnecting', () => this.emit('ws-reconnecting'));

        this.ws.reconnect();


        this.on('signed-in', () => {
            this.connect();
        });

        this.on('signed-out', () => {
            if (this.win) {
                this.win.webContents.send('signed-out');
            }
        });

        ipcMain.handle('login', (event, data) => {
            return this.signin(data.username, data.password);
        });
    }

    get request() {
        return axios.create({
            baseURL: this.store.api_host,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'authorization': this.store.token,
            },
        });
    }

    async getToken() {
        if (!this.store.token) {
            this.store.token = await keytar.getPassword('dupbit', 'token');
        }

        this.emit(this.store.token ? 'signed-in' : 'signed-out');

        return this.store.token;
    }

    async setToken(token) {
        this.store.token = token;

        this.emit(token ? 'signed-in' : 'signed-out');

        if (token) {
            await keytar.setPassword('dupbit', 'token', token);
        } else {
            await keytar.deletePassword('dupbit', 'token');
        }
    }

    async validateToken() {
        await this.getToken();

        const response = await this.request.get('/account');
        const result = response.data;

        if (!result) return;

        if (result.success) {
            this.store.auth = result;
        } else {
            this.store.auth = null;
            await this.setToken(null);
        }

        this.emit(result.success ? 'signed-in' : 'signed-out');
    }

    async connect(open=true) {
        this.ws._shouldRetry = open;

        if (open) {
            this.ws.reconnect();
        } else {
            this.ws.destroy();
        }
    }

    async signin(username, password) {
        const response = await this.request.post('/account/login', { username, password });
        const result = response.data;

        if (result && result.success) {
            this.store.auth = result.user;
            await this.setToken(result.string);
        }

        return result;
    }

    async signout() {
        this.store.auth = null;
        await this.setToken(null);
        await this.connect(false);
    }
}

export default Core;
