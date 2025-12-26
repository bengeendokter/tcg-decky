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
import { Field, type FieldTree, form } from '@angular/forms/signals';
import { TcgDex } from '../../../../../libs/deck-builder/data-access/tcg-dex';
import type { TcgDexCollectionCard } from '../../../../../libs/deck-builder/model/tcg-dex-collection-card';
import { CATEGORY } from '../../../../../libs/limitless/model/limitless-deck';
import type { CollectionCard } from '../../../../../libs/collection/model/collection-card';
import { ENERGY_IDS } from '../../../../../libs/prebuild/model/energy';
import { Collection } from '../../../../../libs/deck-builder/data-access/collection';
import { TcgCard } from '../../components/tcg-card/tcg-card';

@Component({
	selector: 'overview-page',
	imports: [Field, TcgCard],
	templateUrl: './overview-page.html',
	styleUrl: './overview-page.css',
})
export class OverviewPage {
	private readonly collection: Collection = inject(Collection);
	private readonly tcgDex: TcgDex = inject(TcgDex);

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

	constructor() {
		effect(() => {
			const collectionCards: CollectionCard[] = this.collectionCards();

			const energies: CollectionCard[] = ENERGY_IDS.map((_id) => ({
				_id,
				variants: { normal: 99 },
			}));

			this.tcgDex.collectionCards.set(collectionCards.concat(energies));
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
}
