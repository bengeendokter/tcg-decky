import {
	Component,
	ElementRef,
	output,
	OutputEmitterRef,
	viewChild,
	type Signal,
} from '@angular/core';

@Component({
	selector: 'reset-deck-dialog',
	imports: [],
	templateUrl: './reset-deck-dialog.html',
	styleUrl: './reset-deck-dialog.css',
})
export class ResetDeckDialog {
	private readonly resetDeckDialog: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('resetDeckDialog');
	public readonly resetDeck: OutputEmitterRef<void> = output();

	public openResetDeckDialog(): void {
		this.resetDeckDialog().nativeElement.showModal();
	}

	protected closeResetDeckDialog(): void {
		this.resetDeckDialog().nativeElement.close();
	}

	protected resetDeckAndCloseDialog(): void {
		this.resetDeck.emit();
		this.closeResetDeckDialog();
	}
}
