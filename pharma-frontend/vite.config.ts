import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

/**
 *
 * Might need this code later
 *
const paths = {
  "Components/*": "./src/Components/*",
  "Hooks/*": "./src/Hooks/*",
  "Context/*": "./src/Context/*",
  "Interfaces/*": "./src/Interfaces/*",
  "Pages/*": "./src/Pages/*",
  "Reducers/*": "./src/Reducers/*",
  "assets/*": "./src/assets/*"
};

const alias = Object.entries(paths).reduce((acc, [key, value]) => {
  const aliasKey = key.substring(0, key.length - 2);
  const path = value.substring(0, value.length - 2);
  return {
    ...acc,
    [aliasKey]: resolve(__dirname, path)
  };
}, { });

*/
export default defineConfig({
  server: {
    host: true
  },
  build: {
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      }
    }
  },
  plugins: [react(), tsConfigPaths()]
});
