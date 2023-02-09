import vue from "@vitejs/plugin-vue";
import Inspect from "vite-plugin-inspect";
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver} from 'unplugin-vue-components/resolvers'
import targetTransformedVueSrc from './transformed-vue-src'

const fileRegex = /\.(md|vue)$/

const createMyPlugin = () => {
  const myPlugin = {
    name: "vite-md-parse",
    transform(code, id) {
      if (fileRegex.test(id)) {
        return targetTransformedVueSrc(code, id)
      }
    },
  };
  return [
    myPlugin,
    vue({ include: [/\.vue$/, /\.md$/] }),
    vueJsx(),
    Components({
      include: [/\.vue$/, /\.md$/],
      resolvers: [NaiveUiResolver()]
    }),
    Inspect()];
};

export default createMyPlugin;
