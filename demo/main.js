import { createApp } from "vue";
import App from "./App.vue";
import setupRouter from './routes/router'
import setupStore from "./store";
import { installDemoComponents } from './setup'

const app = createApp(App)

setupRouter(app)

setupStore(app)

installDemoComponents(app)

app.mount("#app");
