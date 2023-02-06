import vue from "@vitejs/plugin-vue";
import Inspect from "vite-plugin-inspect";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import mdToVue from "./mdToVue";

const fileRegex = /\.md$/;

const createMyPlugin = () => {
  const myPlugin = {
    name: "parse-md",
    transform(code, id) {
      if (fileRegex.test(id)) {
        return mdToVue(code);
      }
    },
  };
  return [
    myPlugin,
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Inspect(),
    Components({
      include: [/\.vue$/, /\.md$/],
      resolvers: [NaiveUiResolver()],
    }),
  ];
};

export default createMyPlugin;
