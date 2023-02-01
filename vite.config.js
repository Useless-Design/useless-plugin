import { defineConfig } from "vite";
import createMyPlugin from "./plugins";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [createMyPlugin()],
});
