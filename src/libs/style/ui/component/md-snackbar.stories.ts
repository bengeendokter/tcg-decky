import { html } from 'lit';
import preview from '#.storybook/preview';

const meta = preview.meta({
	title: 'Components/Snackbar',
});

export const Primary = meta.story({
	render: () => html`<div style="min-height: 150px">
		<output class="md-snackbar">Snackbar without action</output>
	</div>`,
});
