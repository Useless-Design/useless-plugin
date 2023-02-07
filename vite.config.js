import { defineConfig } from "vite";
import createMyPlugin from "./plugins";

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  plugins: [createMyPlugin()],
  resolve: {
    alias:
      process.env.NODE_ENV !== 'production'
        ? [
          {
            find: 'useless-ui',
            replacement: path.resolve(__dirname, './src')
          },
          {
            find: 'useless-ui/hooks',
            replacement: path.resolve(__dirname, './src/hooks.ts')
          }
        ]
        : undefined
  },
});
