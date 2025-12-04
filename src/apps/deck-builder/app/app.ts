import {
	Component,
	computed,
	effect,
	inject,
	signal,
	type ResourceRef,
	type Signal,
	type WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Collection } from '../../../libs/deck-builder/data-access/collection';
import type { CollectionCard } from '../../../libs/collection/model/collection-card';
import { TcgDex } from '../../../libs/deck-builder/data-access/tcg-dex';
import type { Card } from '@tcgdex/sdk';
import type { TcgDexCollectionCard } from '../../../libs/deck-builder/model/tcg-dex-collection-card';

type DeckCard = Omit<Card, 'variants'> & { quantity: number };

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.css',
})
export class App {
	private readonly collection: Collection = inject(Collection);
	private readonly tcgDex: TcgDex = inject(TcgDex);
	private readonly getAllCardsResource: ResourceRef<
		CollectionCard[] | undefined
	> = this.collection.getAllCardsResource;
	private readonly tcgDexCollectionCardsResource: ResourceRef<
		TcgDexCollectionCard[] | undefined
	> = this.tcgDex.tcgDexCollectionCardsResource;

	protected collectionCards: Signal<CollectionCard[]> = computed(() => {
		if (!this.getAllCardsResource.hasValue()) {
			return [];
		}

		return this.getAllCardsResource.value();
	});

	protected tcgDexCollectionCards: Signal<TcgDexCollectionCard[]> = computed(
		() => {
			if (!this.tcgDexCollectionCardsResource.hasValue()) {
				return [];
			}

			return this.tcgDexCollectionCardsResource.value();
		},
	);

	protected deckCards: WritableSignal<DeckCard[]> = signal([]);

	constructor() {
		effect(() => {
			const collectionCards: CollectionCard[] = this.collectionCards();
			this.tcgDex.collectionCards.set(collectionCards);
		});
	}

	protected async getAllCards(): Promise<void> {
		this.getAllCardsResource.reload();
	}

	protected addCard(card: TcgDexCollectionCard): void {
		const deckCards: DeckCard[] = this.deckCards();

		if (deckCards.length === 0) {
			this.deckCards.set([{ ...card, quantity: 1 }]);
			return;
		}

		const existingDeckCard: DeckCard | undefined = deckCards.find(
			(deckCard) => deckCard.id === card.id,
		);

		if (existingDeckCard === undefined) {
			this.deckCards.set([...deckCards, { ...card, quantity: 1 }]);
			return;
		}

		const deckCardsWithNewQuantities: DeckCard[] = deckCards.map((deckCard) => {
			if (deckCard.id !== existingDeckCard.id) {
				return deckCard;
			}

			return { ...deckCard, quantity: existingDeckCard.quantity + 1 };
		});

		this.deckCards.set(deckCardsWithNewQuantities);
	}

	protected getQuantitySum(variants: CollectionCard['variants']): number {
		const firstEdition: number = variants.firstEdition ?? 0;
		const holo: number = variants.holo ?? 0;
		const normal: number = variants.normal ?? 0;
		const reverse: number = variants.reverse ?? 0;
		const wPromo: number = variants.wPromo ?? 0;

		return firstEdition + holo + normal + reverse + wPromo;
	}
}
