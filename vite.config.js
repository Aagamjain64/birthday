import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { responsesApi } from "./server/responses.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.MONGODB_URI ??= env.MONGODB_URI;
  process.env.MONGODB_DB ??= env.MONGODB_DB;

  return {
    plugins: [
      react(),
      {
        name: "birthday-responses-api",
        configureServer(server) {
          server.middlewares.use(responsesApi());
        },
        configurePreviewServer(server) {
          server.middlewares.use(responsesApi());
        },
      },
    ],
  };
});
