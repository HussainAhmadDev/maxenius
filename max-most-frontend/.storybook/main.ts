// main.ts
import { InlineConfig, mergeConfig } from "vite";
import { resolve } from "path";

const projectRootDir = resolve(__dirname);

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@chromatic-com/storybook",
    "@storybook/addon-mdx-gfm"
  ],

  framework: {
    name: "@storybook/react-vite",

    options: {}
  },

  features: {
    storyStoreV7: true
  },

  async viteFinal(config, options) {
    const cfg: InlineConfig = {
      resolve: {
        // fundamental to allow Storybook resolves components
        alias: {
          src: resolve(projectRootDir, "/src"),
          components: resolve(projectRootDir, "/src/Components")
        }
      },
      build: {
        sourcemap: "inline"
      },
      server: {}
    };
    return mergeConfig(config, cfg);
  },

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};

export default config;
