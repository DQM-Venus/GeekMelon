import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useThemePreference } from './composables/useThemePreference';
import './assets/main.css';
useThemePreference();
createApp(App).use(router).mount('#app');
