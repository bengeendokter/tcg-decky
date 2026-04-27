import { html } from "lit";
import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Button",
});

export const Filled = meta.story({
  render: () => html`<button>Filled</button>`,
});

export const Tonal = meta.story({
  render: () => html`<button class="md-tonal-button">Tonal</button>`,
});

export const Text = meta.story({
  render: () => html`<button class="md-text-button">Text</button>`,
});

export const Icon = meta.story({
  render: () => html`<button class="md-icon-button">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
      <path
        d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"
      />
    </svg>
  </button>`,
});

export const TonalIcon = meta.story({
  render: () => html`<button class="md-tonal-button md-icon-button">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
      <path
        d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"
      />
    </svg>
  </button>`,
});
