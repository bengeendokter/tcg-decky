import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
	title: "Button"
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`<button>Button</button>`,
};
