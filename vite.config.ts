import { defineConfig } from "vite";

export default defineConfig({
  // Relative base so the built site works from any path — including a GitHub
  // Pages project subpath (https://<user>.github.io/<repo>/). No repo name to
  // hardcode. For a user/org site (<user>.github.io) this still resolves fine.
  base: "./",
  server: { port: 5173, host: true },
  build: {
    target: "es2020",
  },
});
