import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Button",
};

export default meta;
type Story = StoryObj;

export const Filled: Story = {
  render: () => html`<button>Filled</button>`,
};

export const Tonal: Story = {
  render: () => html`<button class="md-tonal-button">Tonal</button>`,
};

export const Text: Story = {
  render: () => html`<button class="md-text-button">Text</button>`,
};

export const Icon: Story = {
  render: () => html`<button class="md-icon-button">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
      <path
        d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"
      />
    </svg>
  </button>`,
};

export const TonalIcon: Story = {
  render: () => html`<button class="md-tonal-button md-icon-button">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
      <path
        d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"
      />
    </svg>
  </button>`,
};
