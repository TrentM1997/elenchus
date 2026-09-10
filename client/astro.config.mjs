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
              "/search": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/firecrawl_extractions": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/firecrawl_extractions/:jobId": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/deleteUser": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/getBlueSkyFeed": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/supabaseLogIn": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/getUserArticles": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/getUserResearch": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/articleOperation": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/saveResearch": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/signUserOut": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/resetUserPassword": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/getCurrentUser": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/createNewUser": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/sendFeedback": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/passwordReset": {
                target: "http://localhost:5001",
                changeOrigin: true,
              },
              "/newsArticles": {
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
