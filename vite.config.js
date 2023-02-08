import { defineConfig } from "vite";
import createMyPlugin from "./plugins";
import path from 'path'
const { babel } = require('@rollup/plugin-babel')

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
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'codesandbox/lib/api/define',
      'highlight.js/lib/core',
      'highlight.js/lib/languages/javascript',
      'highlight.js/lib/languages/python',
      'highlight.js/lib/languages/cpp',
      'highlight.js/lib/languages/xml',
      '@vicons/ionicons5',
      '@vicons/ionicons4',
      '@vicons/fluent/Compose16Regular.js'
    ]
  },
  build: {
    outDir: 'site',
    output: {
      manualChunks: {
        'grapheme-splitter': ['grapheme-splitter'],
        katex: ['katex']
      }
    },
    rollupOptions: {
      plugins: [
        babel({
          babelHelpers: 'bundled'
        })
      ]
    }
  }
});
