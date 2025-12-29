import {
	Component,
	ElementRef,
	input,
	output,
	OutputEmitterRef,
	viewChild,
	type InputSignal,
	type Signal,
} from '@angular/core';
import { Field, type FieldTree } from '@angular/forms/signals';

@Component({
	selector: 'rename-deck-dialog',
	imports: [Field],
	templateUrl: './rename-deck-dialog.html',
	styleUrl: './rename-deck-dialog.css',
})
export class RenameDeckDialog {
	private readonly renameDeckDialog: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('renameDeckDialog');
	public readonly deckRenameForm: InputSignal<FieldTree<string>> =
		input.required();
	public readonly renameDeck: OutputEmitterRef<void> = output();

	public openRenameDeckDialog(): void {
		this.renameDeckDialog().nativeElement.showModal();
	}

	protected closeRenameDeckDialog(): void {
		this.renameDeckDialog().nativeElement.close();
	}

	protected renameDeckAndCloseDialog(): void {
		this.renameDeck.emit();
		this.closeRenameDeckDialog();
	}
}
