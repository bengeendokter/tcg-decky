import {
	Component,
	input,
	output,
	OutputEmitterRef,
	type InputSignal,
} from '@angular/core';
import { TcgCard } from '../tcg-card/tcg-card';
import type { TcgDexCollectionCard } from '../../../../../libs/deck-builder/model/tcg-dex-collection-card';
import type { DeckCard } from '../../../../../libs/deck-builder/model/deck-card';

@Component({
	selector: 'deck-pane',
	imports: [TcgCard],
	templateUrl: './deck-pane.html',
	styleUrl: './deck-pane.css',
})
export class DeckPane {
	public readonly deckName: InputSignal<string> = input.required();
	public readonly totalCardQuantity: InputSignal<number> = input.required();
	public readonly existingDeck: InputSignal<boolean> = input.required();
	public readonly deckCards: InputSignal<DeckCard[]> = input.required();
	public readonly updateCollectionCardDeck: OutputEmitterRef<void> =
		output();
	public readonly addCollectionCardDeck: OutputEmitterRef<void> =
		output();
	public readonly openLoadDeckDialog: OutputEmitterRef<void> =
		output();
	public readonly reset: OutputEmitterRef<void> =
		output();
	public readonly deleteCollectionCardDeck: OutputEmitterRef<void> =
		output();
	public readonly openLimitlessDeckBuilder: OutputEmitterRef<void> =
		output();
	public readonly openCardDetail: OutputEmitterRef<TcgDexCollectionCard> =
		output();
}
