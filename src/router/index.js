import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const setupRouter = (app) => {
  app.use(router);
};

export default setupRouter;
