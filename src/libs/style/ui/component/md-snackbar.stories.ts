import { html } from "lit";
import preview from "#.storybook/preview";

const meta = preview.meta({
  title: "Components/Snackbar",
});

export const Primary = meta.story({
  render: () => html`<output class="md-snackbar">Snackbar without action</output>`,
});
