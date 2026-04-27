import { definePreview } from "@storybook/web-components-vite";
import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";

export default definePreview({
  addons: [addonA11y(), addonDocs()],
	tags: ['autodocs'],
  parameters: {
    a11y: {
      options: { xpath: true },
    },
  },
});
