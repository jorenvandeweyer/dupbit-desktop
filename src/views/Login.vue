<template>
    <div class="w-full h-full">
        <div class="h-full flex flex-col items-center justify-center">
            <div class="p-4 flex flex-col">
                <h1 class="font-medium text-lg">Login</h1>
                <div v-if="error" class="text-red-500">{{ error }}</div>
                <input
                    type="text"
                    class="mt-4 px-2 py-1 rounded bg-black border-white border text-white"
                    v-model="username"
                    v-on:keyup.enter="login()"
                    placeholder="username">
                <input
                    type="password"
                    class="mt-4 px-2 py-1 rounded bg-black border-white border text-white"
                    v-model="password"
                    v-on:keyup.enter="login()"
                    placeholder="password">
                <button
                    @click="login()"
                    class="mt-8 border-white border rounded mx-4 hover:text-black hover:bg-white"
                >Login</button>
                <router-link class="mt-8 hover:underline" to="/register">Register</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';

export default {
    data() {
        return {
            username: '',
            password: '',
            error: null,
        };
    },
    methods: {
        async login() {
            this.error = null;

            const result = await ipcRenderer.invoke('login', {
                username: this.username,
                password: this.password,
            });

            if (result && result.success) {
                this.$root.auth = result.user;

                this.username = null;
                this.password = null;

                this.$router.push({path: '/'});
            } else {
                this.password = null;
                this.error = result?.reason || 'Username or password incorrect';
            }
        }
    }
}
</script>
