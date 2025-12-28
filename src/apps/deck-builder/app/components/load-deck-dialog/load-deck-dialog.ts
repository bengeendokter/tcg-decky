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
import type { WithId } from 'mongodb';
import type { CollectionCardDeck } from '../../../../../libs/collection/model/collection-card';

@Component({
	selector: 'load-deck-dialog',
	imports: [Field],
	templateUrl: './load-deck-dialog.html',
	styleUrl: './load-deck-dialog.css',
})
export class LoadDeckDialog {
	private readonly loadDeckDialog: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('loadDeckDialog');
	public readonly sortedCollectionDecks: InputSignal<
		WithId<CollectionCardDeck>[]
	> = input.required();
	public readonly loadDeckForm: InputSignal<FieldTree<string>> =
		input.required();
	public readonly loadDeck: OutputEmitterRef<void> = output();

	public openLoadDeckDialog(): void {
		this.loadDeckDialog().nativeElement.showModal();
	}

	protected closeLoadDeckDialog(): void {
		this.loadDeckDialog().nativeElement.close();
	}

	protected loadDeckAndCloseDialog(): void {
		this.loadDeck.emit()
		this.closeLoadDeckDialog();
	}
}
