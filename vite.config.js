import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@prisma/client/runtime/library": path.resolve(
        __dirname,
        "./src/core/shims/prisma-browser-shim.ts"
      ),
      "@prisma/client": path.resolve(
        __dirname,
        "./src/core/shims/prisma-browser-shim.ts"
      ),
      "next/cache": path.resolve(
        __dirname,
        "./src/core/shims/next-cache-shim.ts"
      ),
      zod: path.resolve(__dirname, "./src/core/shims/zod-browser-shim.ts"),
    },
  },
});
