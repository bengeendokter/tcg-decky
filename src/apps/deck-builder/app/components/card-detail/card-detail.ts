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
import { TcgCard } from '../tcg-card/tcg-card';
import type { DeckCard } from '../../../../../libs/deck-builder/model/deck-card';
import { getQuantitySum } from '../../../../../libs/deck-builder/util/get-quantity-sum';

@Component({
	selector: 'card-detail',
	imports: [TcgCard],
	templateUrl: './card-detail.html',
	styleUrl: './card-detail.css',
})
export class CardDetail {
	private readonly cardDetail: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('cardDetail');
	public readonly selectedDeckCard: InputSignal<DeckCard | undefined> = input();
	protected readonly getQuantitySum: typeof getQuantitySum = getQuantitySum;
	public readonly removeCard: OutputEmitterRef<DeckCard> = output();
	public readonly addCard: OutputEmitterRef<DeckCard> = output();

	public openCardDetail(): void {
		this.cardDetail().nativeElement.showModal();
	}

	protected closeCardDetail(): void {
		this.cardDetail().nativeElement.close();
	}
}
