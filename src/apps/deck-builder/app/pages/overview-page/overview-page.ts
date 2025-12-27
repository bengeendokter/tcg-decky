import {
	Component,
	computed,
	effect,
	ElementRef,
	inject,
	signal,
	viewChild,
	type ResourceRef,
	type Signal,
	type WritableSignal,
} from '@angular/core';
import { Field, type FieldTree, form } from '@angular/forms/signals';
import { TcgDex } from '../../../../../libs/deck-builder/data-access/tcg-dex';
import type { TcgDexCollectionCard } from '../../../../../libs/deck-builder/model/tcg-dex-collection-card';
import {
	CATEGORY,
	type LimitlessDeck,
} from '../../../../../libs/limitless/model/limitless-deck';
import type {
	CollectionCard,
	CollectionCardDeck,
} from '../../../../../libs/collection/model/collection-card';
import { ENERGY_IDS } from '../../../../../libs/prebuild/model/energy';
import { Collection } from '../../../../../libs/deck-builder/data-access/collection';
import { TcgCard } from '../../components/tcg-card/tcg-card';
import { converLimitlessDeckToImportString } from '../../../../../libs/limitless/feature/convert-limitless-deck-to-import-string';
import type { WithId } from 'mongodb';

type DeckCard = TcgDexCollectionCard & {
	quantity: number;
};

const REGULATION_MARKS_IN_ROTAION = ['G', 'H', 'I'] as const satisfies string[];

const POKEMON_TYPE = {
	GRASS: 'Grass',
	FIRE: 'Fire',
	WATER: 'Water',
	LIGHTNING: 'Lightning',
	FIGHTING: 'Fighting',
	PSYCHIC: 'Psychic',
	COLORLESS: 'Colorless',
	DARKNESS: 'Darkness',
	METAL: 'Metal',
	DRAGON: 'Dragon',
} as const satisfies Record<Uppercase<string>, string>;

type PokemonType = (typeof POKEMON_TYPE)[keyof typeof POKEMON_TYPE];

const POKEMON_TYPES = [
	POKEMON_TYPE.GRASS,
	POKEMON_TYPE.FIRE,
	POKEMON_TYPE.WATER,
	POKEMON_TYPE.LIGHTNING,
	POKEMON_TYPE.FIGHTING,
	POKEMON_TYPE.PSYCHIC,
	POKEMON_TYPE.COLORLESS,
	POKEMON_TYPE.DARKNESS,
	POKEMON_TYPE.METAL,
	POKEMON_TYPE.DRAGON,
] as const satisfies PokemonType[];

@Component({
	selector: 'overview-page',
	imports: [Field, TcgCard],
	templateUrl: './overview-page.html',
	styleUrl: './overview-page.css',
})
export class OverviewPage {
	private readonly collection: Collection = inject(Collection);
	private readonly tcgDex: TcgDex = inject(TcgDex);
	private readonly cardDetail: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('cardDetail');
	private readonly loadDeckDialog: Signal<ElementRef<HTMLDialogElement>> =
		viewChild.required('loadDeckDialog');

	protected selectedCard: WritableSignal<TcgDexCollectionCard | undefined> =
		signal(undefined);

	private readonly getAllCardsResource: ResourceRef<
		CollectionCard[] | undefined
	> = this.collection.getAllCardsResource;

	protected collectionCards: Signal<CollectionCard[]> = computed(() => {
		if (!this.getAllCardsResource.hasValue()) {
			return [];
		}

		return this.getAllCardsResource.value();
	});

	protected search: WritableSignal<string> = signal('');
	protected searchForm: FieldTree<string> = form(this.search);

	protected tcgDexCollectionCards: Signal<TcgDexCollectionCard[]> =
		this.tcgDex.tcgDexCollectionCards;

	protected inRotationFilter: WritableSignal<boolean> = signal(false);

	protected inRotationFilterForm: FieldTree<boolean> = form(
		this.inRotationFilter,
	);

	protected POKEMON_TYPES: typeof POKEMON_TYPES = POKEMON_TYPES;

	protected pokemonTypeFilter: WritableSignal<PokemonType | 'All'> =
		signal('All');

	protected pokemonTypeFilterForm: FieldTree<PokemonType | 'All'> = form(
		this.pokemonTypeFilter,
	);

	protected filteredTcgDexCollectionCards: Signal<TcgDexCollectionCard[]> =
		computed(() => {
			let filteredTcgDexCollectionCards: TcgDexCollectionCard[] =
				this.tcgDexCollectionCards();

			const searchValue: string = this.searchForm().value().toLocaleLowerCase();

			if (searchValue) {
				filteredTcgDexCollectionCards = filteredTcgDexCollectionCards.filter(
					(card) => {
						return card.name.toLocaleLowerCase().includes(searchValue);
					},
				);
			}

			if (this.inRotationFilter()) {
				filteredTcgDexCollectionCards = filteredTcgDexCollectionCards.filter(
					(card) => {
						if (card.category === CATEGORY.ENERGY) {
							return true;
						}

						const allowedRegulationMarks: string[] =
							REGULATION_MARKS_IN_ROTAION;

						return allowedRegulationMarks.includes(card.regulationMark ?? '');
					},
				);
			}

			const pokemonTypeFilter: PokemonType | 'All' = this.pokemonTypeFilter();

			if (pokemonTypeFilter !== 'All') {
				filteredTcgDexCollectionCards = filteredTcgDexCollectionCards.filter(
					(card) => {
						return (card.types ?? []).includes(pokemonTypeFilter);
					},
				);
			}

			return filteredTcgDexCollectionCards;
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

	private readonly loadedDeckTcgDexCollectionCardsResource: ResourceRef<
		TcgDexCollectionCard[] | undefined
	> = this.tcgDex.loadedDeckTcgDexCollectionCardsResource;

	protected loadedDeckCollectionCards: Signal<TcgDexCollectionCard[]> =
		computed(() => {
			if (!this.loadedDeckTcgDexCollectionCardsResource.hasValue()) {
				return [];
			}

			return this.loadedDeckTcgDexCollectionCardsResource.value();
		});

	protected deckCards: WritableSignal<DeckCard[]> = signal([]);

	protected totalCardQuantity: Signal<number> = computed(() => {
		return this.deckCards().reduce((total, card) => {
			return total + card.quantity;
		}, 0);
	});

	protected selectedDeckCard: Signal<DeckCard | undefined> = computed(() => {
		const selectedCard: TcgDexCollectionCard | undefined = this.selectedCard();

		if (selectedCard === undefined) {
			return undefined;
		}

		const deckCards: DeckCard[] = this.deckCards();

		const selectedDeckCard: DeckCard | undefined = deckCards.find(
			(deckCard) => {
				return deckCard._id === selectedCard._id;
			},
		);

		const selectedCollectionCard: CollectionCard | undefined =
			this.collectionCards().find((collectionCard) => {
				return collectionCard._id === selectedCard._id;
			});

		const variants: CollectionCard['variants'] =
			selectedCollectionCard?.variants ?? { normal: 99 };

		if (selectedDeckCard === undefined) {
			return {
				...selectedCard,
				variants,
				quantity: 0,
			};
		}

		return { ...selectedDeckCard, variants };
	});

	private deckCollectionCards: Signal<CollectionCard[]> = computed(() => {
		return this.deckCards().map((deckCard) => {
			return { ...deckCard, variants: { normal: deckCard.quantity } };
		});
	});

	private readonly getAllDecksResource: ResourceRef<
		WithId<CollectionCardDeck>[] | undefined
	> = this.collection.getAllDecksResource;

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

	protected existingDeck: Signal<boolean> = computed(() => {
		return this.selectedDeckId() !== '';
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

	protected selectedLoadDeckId: WritableSignal<string> = signal('');

	protected loadDeckForm: FieldTree<string> = form(this.selectedLoadDeckId);

	protected deckName: Signal<string> = computed(() => {
		const selectedDeck: CollectionCardDeck | undefined = this.selectedDeck();

		if (selectedDeck === undefined) {
			return '';
		}

		return selectedDeck.name;
	});

	constructor() {
		effect(() => {
			const collectionCards: CollectionCard[] = this.collectionCards();

			const energies: CollectionCard[] = ENERGY_IDS.map((_id) => ({
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

	protected getQuantitySum(variants: CollectionCard['variants']): number {
		const firstEdition: number = variants.firstEdition ?? 0;
		const holo: number = variants.holo ?? 0;
		const normal: number = variants.normal ?? 0;
		const reverse: number = variants.reverse ?? 0;
		const wPromo: number = variants.wPromo ?? 0;

		return firstEdition + holo + normal + reverse + wPromo;
	}

	protected openCardDetail(card: TcgDexCollectionCard): void {
		this.selectedCard.set(card);
		this.cardDetail().nativeElement.showModal();
	}

	protected closeCardDetail(): void {
		this.cardDetail().nativeElement.close();
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
		this.tcgDex.loadedDeckCollectionCards.set([]);
		this.selectedDeckId.set('');
	}

	protected async openLimitlessDeckBuilder(): Promise<void> {
		const limitlessDeck: LimitlessDeck =
			await this.tcgDex.convertCollectionToLimitlessDeck({
				name: this.deckName(),
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
		const name: string | null = prompt('Deck name:', this.deckName());

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

	protected openLoadDeckDialog(): void {
		this.selectedLoadDeckId.set('');
		this.loadDeckDialog().nativeElement.showModal();
	}

	protected closeLoadDeckDialog(): void {
		this.loadDeckDialog().nativeElement.close();
	}

	protected loadDeck(): void {
		this.selectedDeckId.set(this.selectedLoadDeckId());
		this.closeLoadDeckDialog();
	}

	protected async deleteCollectionCardDeck(): Promise<void> {
		await this.collection.deleteCollectionCardDeck(this.selectedDeckId());
		alert('Deck has been deleted!');

		this.getAllDecksResource.reload();
		this.reset();
	}

	protected async updateCollectionCardDeck(): Promise<void> {
		const selectedDeck: CollectionCardDeck | undefined = this.selectedDeck();

		if (selectedDeck === undefined) {
			alert('Updating deck failed.');
			return;
		}

		const name: string | null = prompt('Deck name:', this.deckName());

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
}
