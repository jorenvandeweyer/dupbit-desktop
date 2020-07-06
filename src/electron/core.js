import EventEmitter from 'events';
import keytar from 'keytar';
import axios from 'axios';
import Websocket from '../websocket';

import { ipcMain } from 'electron';

class Core extends EventEmitter {
    constructor (store) {
        super();

        this.store = store;
        this.ws = null;

        this.setup();

        ipcMain.handle('login', async (event, data) => {
            const response = await this.request.post('/account/login', data);
            const result = response.data;

            if (result && result.success) {
                this.store.auth = result.user;
                this.store.token = result.string;
            }

            return result;
        });
    }

    async setup() {
        this.store.token = await keytar.getPassword('dupbit', 'token');

        this.ws = new Websocket(this.store);
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

}

export default Core;
