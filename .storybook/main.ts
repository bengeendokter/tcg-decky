// Replace your-framework with the framework you are using (e.g., react-vite, nextjs, nextjs-vite)
import { defineMain } from "@storybook/web-components-vite/node";

export default defineMain({
  framework: "@storybook/web-components-vite",
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
});
