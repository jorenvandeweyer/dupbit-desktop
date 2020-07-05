import Vue from 'vue';
import App from './App.vue';
import router from './router';
import guard from './router/guard';

const { remote, ipcRenderer } = require('electron');

import './assets/styles/index.scss';

Vue.config.productionTip = false;

const store = {
    auth: remote.getGlobal('store').auth,
};

router.beforeEach(guard.bind(store));

new Vue({
    router,
    data: store,
    render: h => h(App)
}).$mount('#app');

ipcRenderer.on('logout', () => {
    store.auth = null;
    router.go();
});
