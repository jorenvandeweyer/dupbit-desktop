import { WebSocketClient } from 'ws-async';
import WebSocketHelper from 'ws-async/src/helpers/WebSocket';

import volume from './actions/volume';
import screen from './actions/screen';

export default class extends WebSocketClient {
    constructor(store) {
        super();

        this.store = store;

        this._retry = 0;
        this._delays = [0, 1, 3, 5, 15, 30];


        this.on('close', () => {
            console.log('ws closed');
            this.reconnect();
        });

        this.on('open', () => {
            console.log('ws opened');
            this._retry = 0;
        });

        this.on('error', () => {
            console.log('ws error');
        });

        this.on('message', (message) => {
            this.handle(message);
        });

        this.reconnect();
    }

    async reconnect() {
        console.log('reconnecting...');
        if (!this.store.auth) {
            console.error('cant reconnect not authenticated');
            return;
        }

        if (this._retry > 0) {
            if (this._retry >= this._delays.length) {
                this._retry = this._delays.length - 1;
            }

            await new Promise((resolve) => {
                const delay = this._delays[this._retry];
                console.log(`waiting ${delay} before reconnect`);
                setTimeout(() => resolve(), delay * 1000);
            })
        }

        this._retry++;

        const ws = new WebSocketHelper(`${this.store.ws_host}`, {
            headers: {
                authorization: this.store.token,
            }
        });
        this.attachSocket(ws);
    }

    async handle(message) {
        const { action, data} = message.content || {};

        console.log('HANDLING message');
        console.log(action, data);

        if (!(action in ACTIONS)) {
            console.log('Action not found');
            message.reject('Action not found');
            return;
        }

        try {
            const result = await ACTIONS[action].execute(data);

            console.log(result);

            message.resolve(result);
        } catch (e) {
            message.reject('action not found');
        }
    }
}

const ACTIONS = {
    ...volume,
    ...screen,
    'list': {
        input: null,
        descripion: 'List',
        execute: () => {
            return ACTIONS;
        }
    }
};
