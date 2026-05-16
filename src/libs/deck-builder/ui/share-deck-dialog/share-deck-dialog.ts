import {
	Component,
	ElementRef,
	output,
	OutputEmitterRef,
	viewChild,
	type Signal,
} from '@angular/core';

@Component({
	selector: 'share-deck-dialog',
	imports: [],
	templateUrl: './share-deck-dialog.html',
	styleUrl: './share-deck-dialog.css',
})
export class ShareDeckDialog {
	private readonly shareDeckDialog: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('shareDeckDialog');
	public readonly shareDeck: OutputEmitterRef<void> = output();

	public openShareDeckDialog(): void {
		this.shareDeckDialog().nativeElement.showModal();
	}

	protected closeShareDeckDialog(): void {
		this.shareDeckDialog().nativeElement.close();
	}

	protected shareDeckAndCloseDialog(): void {
		this.shareDeck.emit();
		this.closeShareDeckDialog();
	}
}
