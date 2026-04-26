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
import { type FieldTree } from '@angular/forms/signals';
import type { WithId } from 'mongodb';
import type { CollectionCardDeck } from '../../../../../libs/collection/model/collection-card';

@Component({
	selector: 'load-deck-dialog',
	imports: [],
	templateUrl: './load-deck-dialog.html',
	styleUrl: './load-deck-dialog.css',
})
export class LoadDeckDialog {
	private readonly loadDeckDialog: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('loadDeckDialog');
	public readonly sortedCollectionDecks: InputSignal<WithId<CollectionCardDeck>[]> =
		input.required();
	public readonly loadDeckForm: InputSignal<FieldTree<string>> = input.required();
	public readonly loadDeck: OutputEmitterRef<void> = output();

	public openLoadDeckDialog(): void {
		this.loadDeckDialog().nativeElement.showModal();
	}

	protected closeLoadDeckDialog(): void {
		this.loadDeckDialog().nativeElement.close();
	}

	protected loadDeckAndCloseDialog(): void {
		this.loadDeck.emit();
		this.closeLoadDeckDialog();
	}

	protected handelSelectionChange(event: Event): void {
		const target: EventTarget | null = event.target;

		if (target === null) {
			return;
		}

		if (!(target instanceof HTMLSelectElement)) {
			return;
		}

		const value: string = target.value;

		this.updateLoadDeckForm(value);
	}

	private updateLoadDeckForm(value: string): void {
		this.loadDeckForm()().setControlValue(value);
	}
}
