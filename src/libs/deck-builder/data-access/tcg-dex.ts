import {
	computed,
	Injectable,
	resource,
	signal,
	type ResourceRef,
	type Signal,
	type WritableSignal,
} from '@angular/core';
import { getTcgDex } from '../../tcg-dex/data-access/get-tcg-dex';
import type TCGdex from '@tcgdex/sdk';
import { CONFIG } from '../../../environment/environment';
import type { Card, Set as TcgSet } from '@tcgdex/sdk';
import type {
	CollectionCard,
	CollectionCardDeck,
} from '../../collection/model/collection-card';
import type { TcgDexCollectionCard } from '../model/tcg-dex-collection-card';
import type { LimitlessDeck } from '../../limitless/model/limitless-deck';
import { convertCollectionToLimitlessDeck } from '../../limitless/feature/convert-collection-to-limitless-deck';

@Injectable({ providedIn: 'root' })
export class TcgDex {
	private readonly tcgDex: TCGdex = getTcgDex(CONFIG.TCG_DEX_SERVER_URL);
	public readonly cardId: WritableSignal<string | undefined> =
		signal(undefined);
	public readonly collectionCards: WritableSignal<CollectionCard[]> = signal(
		[],
	);
	public readonly loadedDeckCollectionCards: WritableSignal<CollectionCard[]> =
		signal([]);

	public readonly tcgDexCollectionCards: Signal<TcgDexCollectionCard[]> =
		computed(() => {
			if (!this.tcgDexCollectionCardsResource.hasValue()) {
				return [];
			}

			return this.tcgDexCollectionCardsResource.value();
		});

	private readonly sets: Signal<TcgSet[]> = computed(() => {
		if (!this.getAllSetsResource.hasValue()) {
			return [];
		}

		return this.getAllSetsResource.value();
	});

	public readonly setReleaseDateMap: Signal<Map<string, Date>> = computed(
		() => {
			const sets: TcgSet[] = this.sets();

			return sets
				.map((set): [setId: string, releaseDate: Date] => {
					return [set.id, new Date(set.releaseDate)];
				})
				.reduce((releaseDateMap, [setId, releaseDate]) => {
					return releaseDateMap.set(setId, releaseDate);
				}, new Map<string, Date>());
		},
	);

	private readonly setIds: Signal<Set<string>> = computed(() => {
		const tcgDexCollectionCards: TcgDexCollectionCard[] =
			this.tcgDexCollectionCards();

		const setIds: string[] = tcgDexCollectionCards.map((card) => card.set.id);

		return new Set(setIds);
	});

	private async getSet(setId: string): Promise<TcgSet> {
		const set: TcgSet | null = await this.tcgDex.set.get(setId);

		if (set === null) {
			throw Error('Set not found');
		}

		return set;
	}

	private async getAllSets(setIds: string[]): Promise<TcgSet[]> {
		return await Promise.all(
			setIds.map(async (setId) => {
				return await this.getSet(setId);
			}),
		);
	}

	public readonly getAllSetsResource: ResourceRef<TcgSet[] | undefined> =
		resource({
			params: () => ({ setIds: this.setIds() }),
			loader: ({ params }) => {
				const setIds: string[] = Array.from(params.setIds);

				return this.getAllSets(setIds);
			},
		});

	private async getCard(id: string): Promise<Card | undefined> {
		const card: Card | null = await this.tcgDex.card.get(id);

		if (card === null) {
			return undefined;
		}

		return card;
	}

	public readonly getCardResource: ResourceRef<Card | undefined> = resource({
		params: () => ({ id: this.cardId() }),
		loader: ({ params }) => {
			const id: string | undefined = params.id;

			if (id === undefined) {
				return Promise.resolve(undefined);
			}

			return this.getCard(id);
		},
	});

	public readonly tcgDexCollectionCardsResource: ResourceRef<
		TcgDexCollectionCard[] | undefined
	> = resource({
		params: () => ({ collectionCards: this.collectionCards() }),
		loader: ({ params }) => {
			const collectionCards: CollectionCard[] = params.collectionCards;

			return Promise.all(
				collectionCards.map(async (collectionCard) => {
					const tcgDexCard: Card | undefined = await this.getCard(
						collectionCard._id,
					);

					if (tcgDexCard === undefined) {
						throw Error(`tcgDexCard not found for id: ${collectionCard._id}`);
					}

					return { ...tcgDexCard, ...collectionCard };
				}),
			);
		},
	});

	public readonly loadedDeckTcgDexCollectionCardsResource: ResourceRef<
		TcgDexCollectionCard[] | undefined
	> = resource({
		params: () => ({ collectionCards: this.loadedDeckCollectionCards() }),
		loader: ({ params }) => {
			const collectionCards: CollectionCard[] = params.collectionCards;

			return Promise.all(
				collectionCards.map(async (collectionCard) => {
					const tcgDexCard: Card | undefined = await this.getCard(
						collectionCard._id,
					);

					if (tcgDexCard === undefined) {
						throw Error(`tcgDexCard not found for id: ${collectionCard._id}`);
					}

					return { ...tcgDexCard, ...collectionCard };
				}),
			);
		},
	});

	public async convertCollectionToLimitlessDeck(
		collectionCardDeck: CollectionCardDeck,
	): Promise<LimitlessDeck> {
		return await convertCollectionToLimitlessDeck({
			tcgDex: this.tcgDex,
			collectionCardDeck,
		});
	}
}
