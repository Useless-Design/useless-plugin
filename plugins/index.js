import vue from "@vitejs/plugin-vue";
import Inspect from "vite-plugin-inspect";
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver} from 'unplugin-vue-components/resolvers'

const fileRegex = /\.(md|vue)$/

const createMyPlugin = () => {
  const myPlugin = {
    name: "add-hello-world",
    transform(code, id) {
      if (fileRegex.test(id)) {
        return code
      }
    },
  };
  return [
    myPlugin,
    vue({ include: [/\.vue$/, /\.md$/] }),
    vueJsx(),
    Components({ resolvers: [NaiveUiResolver()] }),
    Inspect()];
};

export default createMyPlugin;
