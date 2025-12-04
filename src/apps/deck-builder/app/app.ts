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
import { form, Field, type FieldTree } from '@angular/forms/signals';

type DeckCard = Omit<Card, 'variants'> & { quantity: number, variants: CollectionCard['variants'] };

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Field],
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

			const tcgDexCollectionCards: TcgDexCollectionCard[] =
				this.tcgDexCollectionCardsResource.value();

			const searchValue: string = this.searchForm().value().toLocaleLowerCase();

			if (searchValue === '') {
				return tcgDexCollectionCards;
			}

			return tcgDexCollectionCards.filter((card) => {
				return card.name.toLocaleLowerCase().includes(searchValue);
			});
		},
	);

	protected deckCards: WritableSignal<DeckCard[]> = signal([]);

	protected totalCardQuantity: Signal<number> = computed(() => {
		return this.deckCards().reduce((total, card) => {
			return total + card.quantity;
		}, 0);
	});

	protected search: WritableSignal<string> = signal('');

	protected searchForm: FieldTree<string> = form(this.search);

	constructor() {
		effect(() => {
			const collectionCards: CollectionCard[] = this.collectionCards();

			const energyIds: string[] = [
				'sm1-164',
				'sm1-165',
				'sm1-166',
				'sm1-167',
				'sm1-168',
				'sm1-169',
				'sm1-170',
				'sm1-171',
			];

			const energies: CollectionCard[] = energyIds.map((_id) => ({
				_id,
				variants: { normal: 99 },
			}));

			this.tcgDex.collectionCards.set(collectionCards.concat(energies));
		});
	}

	protected async getAllCards(): Promise<void> {
		this.getAllCardsResource.reload();
	}

	protected addCard(card: TcgDexCollectionCard | DeckCard): void {
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

			const quantity: number = Math.min(
				existingDeckCard.quantity + 1,
				this.getQuantitySum(card.variants),
			);

			return { ...deckCard, quantity };
		});

		this.deckCards.set(deckCardsWithNewQuantities);
	}

	protected removeCard(card: TcgDexCollectionCard | DeckCard): void {
		const deckCards: DeckCard[] = this.deckCards();

		if (deckCards.length === 0) {
			return;
		}

		const existingDeckCard: DeckCard | undefined = deckCards.find(
			(deckCard) => deckCard.id === card.id,
		);

		if (existingDeckCard === undefined) {
			return;
		}

		const deckCardsWithNewQuantities: DeckCard[] = deckCards.map((deckCard) => {
			if (deckCard.id !== existingDeckCard.id) {
				return deckCard;
			}

			return { ...deckCard, quantity: existingDeckCard.quantity - 1 };
		});

		this.deckCards.set(
			deckCardsWithNewQuantities.filter((card) => {
				return card.quantity > 0;
			}),
		);
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
