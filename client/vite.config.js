import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Polyfill Node.js globals
import buffer from "rollup-plugin-node-polyfills";
import globals from "rollup-plugin-node-globals";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true,
    }),
    NodeModulesPolyfillPlugin(),
  ],
  resolve: {
    alias: {
      crypto: "crypto-browserify",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis", // Ensure globalThis is used
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyfills()],
    },
  },
});