import {
	Component,
	ElementRef,
	output,
	OutputEmitterRef,
	viewChild,
	type Signal,
} from '@angular/core';

@Component({
	selector: 'delete-deck-dialog',
	imports: [],
	templateUrl: './delete-deck-dialog.html',
	styleUrl: './delete-deck-dialog.css',
})
export class DeleteDeckDialog {
	private readonly deleteDeckDialog: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('deleteDeckDialog');
	public readonly deleteDeck: OutputEmitterRef<void> = output();

	public openDeleteDeckDialog(): void {
		this.deleteDeckDialog().nativeElement.showModal();
	}

	protected closeDeleteDeckDialog(): void {
		this.deleteDeckDialog().nativeElement.close();
	}

	protected deleteDeckAndCloseDialog(): void {
		this.deleteDeck.emit();
		this.closeDeleteDeckDialog();
	}
}
