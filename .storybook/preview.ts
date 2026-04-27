import { definePreview } from "@storybook/web-components-vite";
import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";
import { withThemeByClassName } from "@storybook/addon-themes";
import "./preview.css";

export default definePreview({
  addons: [addonA11y(), addonDocs()],
  tags: ["autodocs"],
  parameters: {
    a11y: {
      options: { xpath: true },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        lightMediumContrast: "light-medium-contrast",
        lightHighContrast: "light-high-contrast",
        dark: "dark",
        darkMediumContrast: "dark-medium-contrast",
        darkHighContrast: "dark-high-contrast",
      },
      defaultTheme: "light",
    }),
  ],
  globalTypes: {
    theme: { type: "string" },
  },
});
