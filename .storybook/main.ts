import { defineMain } from "@storybook/web-components-vite/node";

export default defineMain({
  framework: "@storybook/web-components-vite",
  stories: ["../src/libs/*/ui/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
		"@storybook/addon-themes"
  ],
});
