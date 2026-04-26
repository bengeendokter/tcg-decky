import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { html } from "lit";

const meta: Meta = {
  component: "md-button",
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`<button>Button</button>`,
};
