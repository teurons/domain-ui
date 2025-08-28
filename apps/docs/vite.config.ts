import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "fumadocs-mdx/vite";
import * as MdxConfig from "./source.config";

export default defineConfig({
  plugins: [mdx(MdxConfig), tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress sourcemap warnings
        if (warning.code === 'SOURCEMAP_ERROR') return;
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    force: true,
  },
});
