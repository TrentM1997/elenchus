import { defineConfig } from "astro/config";
import { createRequire } from "node:module";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

const require = createRequire(import.meta.url);
const apiTarget = process.env.API_PROXY_TARGET || "http://localhost:5001";

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
          replacement: require.resolve("lottie-react/build/index.es.js"),
        },
      ],
    },
    server: {
      watch: { usePolling: process.env.DEV_USE_POLLING === "true" },
      proxy:
        process.env.NODE_ENV === "development"
          ? {
              "/articles": {
                target: apiTarget,
                changeOrigin: true,
              },
              "/user": {
                target: apiTarget,
                changeOrigin: true,
              },
              "/blueSky": {
                target: apiTarget,
                changeOrigin: true,
              },
              "/wiki": {
                target: apiTarget,
                changeOrigin: true,
              },
              "/auth": {
                target: apiTarget,
                changeOrigin: true,
              },
              "/deleteUser": {
                target: apiTarget,
                changeOrigin: true,
              },
              "/resetUserPassword": {
                target: apiTarget,
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
