import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "src/chrome-extension/manifest.json", dest: "." },
        { src: "src/chrome-extension/public/16.png", dest: "./public" },
        { src: "src/chrome-extension/public/32.png", dest: "./public" },
        { src: "src/chrome-extension/public/48.png", dest: "./public" },
        { src: "src/chrome-extension/public/192.png", dest: "./public" },
      ],
    }),
  ],
  define: {
    "process.env.OPENAI_API_KEY": JSON.stringify(process.env.OPENAI_API_KEY),
  },
  server: {
    open: "/popup-local.html",
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        options: resolve(__dirname, "options.html"),
        background: resolve(__dirname, "src/background.ts"),
        content_script: resolve(__dirname, "src/content.js"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
