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
import { IconComponent } from '../icon/icon.component';
import addIcon from '@material-symbols/svg-400/rounded/add.svg';
import removeIcon from '@material-symbols/svg-400/rounded/remove.svg';

@Component({
	selector: 'card-detail',
	imports: [TcgCard, IconComponent],
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
	protected readonly addIcon: string = addIcon;
	protected readonly removeIcon: string = removeIcon;

	public openCardDetail(): void {
		this.cardDetail().nativeElement.showModal();
	}

	protected closeCardDetail(): void {
		this.cardDetail().nativeElement.close();
	}
}
