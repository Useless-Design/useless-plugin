import { createApp } from "vue";
import App from "./App.vue";
import setupRouter from './routes/router'
import { installDemoComponents } from './setup'

const app = createApp(App)

setupRouter(app)

installDemoComponents(app)

app.mount("#app");
