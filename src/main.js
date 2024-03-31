// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './firebaseConfig'; // Firebase 초기화

const app = createApp(App);
app.use(router);
app.mount('#app');
