import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(),  crx({ manifest })],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
