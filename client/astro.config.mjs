import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  server: {
    port: 5173,
  },
  vite: {
    resolve: {
      alias: [
        {
          // The UMD browser entry wraps the component in a default-export object.
          find: /^lottie-react$/,
          replacement: fileURLToPath(
            new URL("./node_modules/lottie-react/build/index.es.js", import.meta.url),
          ),
        },
      ],
    },
    server: {
      proxy:
        process.env.NODE_ENV === "development"
          ? {
              "/articles": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/user": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/blueSky": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/wiki": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/auth": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/deleteUser": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/resetUserPassword": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
            }
          : undefined,
    },
  },
  markdown: {
    /* ... */
  },
  site: "https://elenchusapp.io/",
  integrations: [sitemap(), react()],
  output: "static",
});
