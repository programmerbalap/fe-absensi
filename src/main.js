import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

// global axios
axios.defaults.baseURL = `https://tired-erin-pantsuit.cyclic.cloud/`;

// global token
const app = createApp(App);
app.provide('accessToken', localStorage.getItem('accessToken'));
app.use(store).use(router).mount('#app');
