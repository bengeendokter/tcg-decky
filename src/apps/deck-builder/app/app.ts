import {
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	PLATFORM_ID,
	signal,
	viewChild,
	type OnInit,
	type ResourceRef,
	type Signal,
	type WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Collection } from '../../../libs/deck-builder/data-access/collection';
import type {
	CollectionCard,
	CollectionCardDeck,
} from '../../../libs/collection/model/collection-card';
import { TcgDex } from '../../../libs/deck-builder/data-access/tcg-dex';
import type { TcgDexCollectionCard } from '../../../libs/deck-builder/model/tcg-dex-collection-card';
import { form, Field, type FieldTree } from '@angular/forms/signals';
import {
	CATEGORY,
	type LimitlessDeck,
} from '../../../libs/limitless/model/limitless-deck';
import { limitlessDeckToString } from '../../../libs/limitless/feature/limitless-deck-to-string';
import type { WithId } from 'mongodb';
import { converLimitlessDeckToImportString } from '../../../libs/limitless/feature/convert-limitless-deck-to-import-string';
import {
	setTheme,
	enableSystemContrastPreferenceListener,
	enableSystemColorSchemePreferenceListener,
} from 'm3-color-css';
import { isPlatformBrowser } from '@angular/common';

type DeckCard = TcgDexCollectionCard & {
	quantity: number;
};

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, Field],
	templateUrl: './app.html',
	styleUrl: './app.css',
})
export class App implements OnInit {
	private readonly collection: Collection = inject(Collection);
	private readonly tcgDex: TcgDex = inject(TcgDex);
	private readonly platformId = inject(PLATFORM_ID);
	private readonly getAllCardsResource: ResourceRef<
		CollectionCard[] | undefined
	> = this.collection.getAllCardsResource;
	private readonly getAllDecksResource: ResourceRef<
		WithId<CollectionCardDeck>[] | undefined
	> = this.collection.getAllDecksResource;
	private readonly loadedDeckTcgDexCollectionCardsResource: ResourceRef<
		TcgDexCollectionCard[] | undefined
	> = this.tcgDex.loadedDeckTcgDexCollectionCardsResource;

	private readonly dialog: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('dialog');

	protected selectedCard: WritableSignal<TcgDexCollectionCard | undefined> =
		signal(undefined);

	protected collectionCards: Signal<CollectionCard[]> = computed(() => {
		if (!this.getAllCardsResource.hasValue()) {
			return [];
		}

		return this.getAllCardsResource.value();
	});

	protected loadedDeckCollectionCards: Signal<TcgDexCollectionCard[]> =
		computed(() => {
			if (!this.loadedDeckTcgDexCollectionCardsResource.hasValue()) {
				return [];
			}

			return this.loadedDeckTcgDexCollectionCardsResource.value();
		});

	private collectionDecks: Signal<WithId<CollectionCardDeck>[]> = computed(
		() => {
			if (!this.getAllDecksResource.hasValue()) {
				return [];
			}

			return this.getAllDecksResource.value();
		},
	);

	protected sortedCollectionDecks: Signal<WithId<CollectionCardDeck>[]> =
		computed(() => {
			const collectionDecks: WithId<CollectionCardDeck>[] =
				this.collectionDecks();

			return collectionDecks.toSorted((card1, card2) => {
				return card1.name.localeCompare(card2.name);
			});
		});

	protected tcgDexCollectionCards: Signal<TcgDexCollectionCard[]> =
		this.tcgDex.tcgDexCollectionCards;

	protected filteredTcgDexCollectionCards: Signal<TcgDexCollectionCard[]> =
		computed(() => {
			const tcgDexCollectionCards: TcgDexCollectionCard[] =
				this.tcgDexCollectionCards();

			const searchValue: string = this.searchForm().value().toLocaleLowerCase();

			if (searchValue === '') {
				return tcgDexCollectionCards;
			}

			return tcgDexCollectionCards.filter((card) => {
				return card.name.toLocaleLowerCase().includes(searchValue);
			});
		});

	protected sortedTcgDexCollectionCards: Signal<TcgDexCollectionCard[]> =
		computed(() => {
			const tcgDexCollectionCards: TcgDexCollectionCard[] =
				this.filteredTcgDexCollectionCards();

			const categorySortOrderMap: Map<string, number> = new Map(
				Object.entries({
					[CATEGORY.POKEMON]: 1,
					[CATEGORY.TRAINER]: 2,
					[CATEGORY.ENERGY]: 3,
				}),
			);

			const setReleaseDateMap: Map<string, Date> =
				this.tcgDex.setReleaseDateMap();

			return tcgDexCollectionCards.toSorted((card1, card2) => {
				const cateorySortValue1: number =
					categorySortOrderMap.get(card1.category) ?? 0;
				const cateorySortValue2: number =
					categorySortOrderMap.get(card2.category) ?? 0;

				const cateorySortDiff: number = cateorySortValue1 - cateorySortValue2;

				if (cateorySortDiff !== 0) {
					return cateorySortDiff;
				}

				const releaseDateSet1: Date =
					setReleaseDateMap.get(card1.set.id) ?? new Date(0);

				const releaseDateSet2: Date =
					setReleaseDateMap.get(card2.set.id) ?? new Date(0);

				const releaseDateDiff: number =
					releaseDateSet1.getTime() - releaseDateSet2.getTime();

				if (releaseDateDiff !== 0) {
					return releaseDateDiff;
				}

				return parseInt(card1.localId) - parseInt(card2.localId);
			});
		});

	protected deckCards: WritableSignal<DeckCard[]> = signal([]);

	protected totalCardQuantity: Signal<number> = computed(() => {
		return this.deckCards().reduce((total, card) => {
			return total + card.quantity;
		}, 0);
	});

	private deckCollectionCards: Signal<CollectionCard[]> = computed(() => {
		return this.deckCards().map((deckCard) => {
			return { ...deckCard, variants: { normal: deckCard.quantity } };
		});
	});

	protected search: WritableSignal<string> = signal('');

	protected searchForm: FieldTree<string> = form(this.search);

	protected selectedDeckId: WritableSignal<string> = signal('');

	private selectedDeck: Signal<CollectionCardDeck | undefined> = computed(
		() => {
			const selectedDeckId: string = this.selectedDeckId();

			if (selectedDeckId === '') {
				return undefined;
			}

			return this.collectionDecks().find(
				(deck) => deck._id.toString() === selectedDeckId,
			);
		},
	);

	protected LoadDeckForm: FieldTree<string> = form(this.selectedDeckId);

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

		effect(() => {
			const selectedDeck: CollectionCardDeck | undefined = this.selectedDeck();

			if (selectedDeck === undefined) {
				return;
			}
			this.tcgDex.loadedDeckCollectionCards.set(selectedDeck.cards);
		});

		effect(() => {
			const loadedDeckCollectionCards: DeckCard[] =
				this.loadedDeckCollectionCards().map((tcgDexCollectionCard) => {
					return {
						...tcgDexCollectionCard,
						quantity: this.getQuantitySum(tcgDexCollectionCard.variants),
					};
				});

			this.deckCards.set(loadedDeckCollectionCards);
		});
	}

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			// set theming
			setTheme();
			enableSystemContrastPreferenceListener();
			enableSystemColorSchemePreferenceListener();
		}
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

			const matchingCollectionCard: CollectionCard | undefined =
				this.tcgDexCollectionCards().find(
					(tcgDexCollectionCard) => tcgDexCollectionCard.id === deckCard.id,
				);

			if (matchingCollectionCard === undefined) {
				return deckCard;
			}

			const collectionMaxQuantity: number = this.getQuantitySum(
				matchingCollectionCard.variants,
			);

			const quantity: number = Math.min(
				existingDeckCard.quantity + 1,
				collectionMaxQuantity,
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

	protected reset(): void {
		this.deckCards.set([]);
		this.selectedDeckId.set('');
	}

	protected getQuantitySum(variants: CollectionCard['variants']): number {
		const firstEdition: number = variants.firstEdition ?? 0;
		const holo: number = variants.holo ?? 0;
		const normal: number = variants.normal ?? 0;
		const reverse: number = variants.reverse ?? 0;
		const wPromo: number = variants.wPromo ?? 0;

		return firstEdition + holo + normal + reverse + wPromo;
	}

	protected async copyLimitlessDeck(): Promise<void> {
		const clipboard: Clipboard | undefined = navigator.clipboard;

		if (!clipboard) {
			alert('Clipboard API not supported');
			return;
		}

		const limitlessDeck: LimitlessDeck =
			await this.tcgDex.convertCollectionToLimitlessDeck({
				name: 'DefaultName',
				cards: this.deckCollectionCards(),
			});

		await navigator.clipboard.writeText(limitlessDeckToString(limitlessDeck));
		alert('Copied to clipboard!');
	}

	protected async openLimitlessDeckBuilder(): Promise<void> {
		const limitlessDeck: LimitlessDeck =
			await this.tcgDex.convertCollectionToLimitlessDeck({
				name: 'DefaultName',
				cards: this.deckCollectionCards(),
			});

		const importString: string =
			converLimitlessDeckToImportString(limitlessDeck);

		const limitlessDeckBuilderUrl: URL = new URL(
			'/builder',
			'https://my.limitlesstcg.com',
		);

		limitlessDeckBuilderUrl.searchParams.set('i', importString);

		window.open(limitlessDeckBuilderUrl.href, '_blank');
	}

	protected async addCollectionCardDeck(): Promise<void> {
		const name: string | null = prompt('Deck name:');

		if (name === null) {
			alert('Deck has not been saved.');
			return;
		}

		const deck: CollectionCardDeck = {
			name,
			cards: this.deckCollectionCards(),
		};

		const id: string = await this.collection.addCollectionCardDeck(deck);
		alert('Deck has been saved!');

		this.getAllDecksResource.reload();
		this.selectedDeckId.set(id);
	}

	protected async updateCollectionCardDeck(): Promise<void> {
		const selectedDeck: CollectionCardDeck | undefined = this.selectedDeck();

		if (selectedDeck === undefined) {
			alert('Updating deck failed.');
			return;
		}

		const name: string | null = prompt('Deck name:', selectedDeck.name);

		if (name === null) {
			alert('Deck has not been updated.');
			return;
		}

		const deck: CollectionCardDeck = {
			name,
			cards: this.deckCollectionCards(),
		};

		await this.collection.updateCollectionCardDeck({
			id: this.selectedDeckId(),
			deck,
		});
		alert('Deck has been updated!');

		this.getAllDecksResource.reload();
	}

	protected async deleteCollectionCardDeck(): Promise<void> {
		await this.collection.deleteCollectionCardDeck(this.selectedDeckId());
		alert('Deck has been deleted!');

		this.getAllDecksResource.reload();
		this.selectedDeckId.set('');
	}

	protected openDetail(card: TcgDexCollectionCard): void {
		this.selectedCard.set(card);
		this.dialog().nativeElement.showModal();
	}

	protected closeDialog(): void {
		this.dialog().nativeElement.close();
	}
}
