import {
	Component,
	computed,
	inject,
	input,
	type InputSignal,
	type Signal,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'icon',
	imports: [],
	template: '',
	styleUrl: './icon.component.css',
	host: {
		'[innerHTML]': 'safeSvg()',
	},
})
export class IconComponent {
	public svg: InputSignal<string> = input.required();
	private sanitizer = inject(DomSanitizer);
	protected safeSvg: Signal<SafeHtml> = computed(() => {
		const svg: string = this.svg();
		return this.sanitizer.bypassSecurityTrustHtml(svg);
	});
}
