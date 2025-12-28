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
	selector: 'create-deck-dialog',
	imports: [Field],
	templateUrl: './create-deck-dialog.html',
	styleUrl: './create-deck-dialog.css',
})
export class CreateDeckDialog {
	private readonly createDeckDialog: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('createDeckDialog');
	public readonly deckNameForm: InputSignal<FieldTree<string>> =
		input.required();
	public readonly createDeck: OutputEmitterRef<void> = output();

	public openCreateDeckDialog(): void {
		this.createDeckDialog().nativeElement.showModal();
	}

	protected closeCreateDeckDialog(): void {
		this.createDeckDialog().nativeElement.close();
	}

	protected createDeckAndCloseDialog(): void {
		this.createDeck.emit();
		this.closeCreateDeckDialog();
	}
}
