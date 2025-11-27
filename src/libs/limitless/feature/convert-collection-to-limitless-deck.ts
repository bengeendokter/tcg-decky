import TCGdex, { type Card } from '@tcgdex/sdk';
import type {
	CollectionCard,
	CollectionCardDeck,
} from '../../collection/model/collection-card.ts';
import {
	CATEGORY,
	isCategory,
	type LimitlessCard,
	type LimitlessCardWithCategory,
	type LimitlessDeck,
} from '../model/limitless-deck.ts';
import type { SetWithAbbreviation } from '../../tcg-dex/model/set-with-abbreviation.ts';

interface ConvertCollectionToLimitlessDeckParams {
	collectionCardDeck: CollectionCardDeck;
	tcgDex: TCGdex;
}

export async function convertCollectionToLimitlessDeck({collectionCardDeck: {
	cards,
	name,
}, tcgDex}: ConvertCollectionToLimitlessDeckParams): Promise<LimitlessDeck> {
	const limitlessCardsWithCategory: LimitlessCardWithCategory[] =
		await Promise.all(
			cards.map(async (collectionCard) => {
				const cardId: string = collectionCard._id;

				const card: Card | null = await tcgDex.card.get(cardId);

				if (!card) {
					throw Error('Card not found');
				}

				const set: SetWithAbbreviation | null = await tcgDex.set.get(
					card.set.id,
				);

				if (!set) {
					throw Error('Set not found');
				}

				const abbreviation: string | undefined = set?.abbreviation?.official;
				let tcgOnline: string | undefined = set.tcgOnline ?? abbreviation;

				if (!tcgOnline) {
					throw Error(
						`Set TCG Online code not found for ${set.name} with ID ${set.id} and abbreviation ${abbreviation}`,
					);
				}

				// handle exceptions
				const exeptionMap: Map<string, string> = new Map([
					['SVP', 'PR-SV'],
					['SV', 'SVI'],
				]);

				tcgOnline = exeptionMap.get(tcgOnline) ?? tcgOnline;

				const variants: CollectionCard['variants'] = collectionCard.variants;

				const firstEdition: number = variants.firstEdition ?? 0;
				const holo: number = variants.holo ?? 0;
				const normal: number = variants.normal ?? 0;
				const reverse: number = variants.reverse ?? 0;
				const wPromo: number = variants.wPromo ?? 0;

				const quantity: number =
					firstEdition + holo + normal + reverse + wPromo;
				const name: string = card.name;
				const localId: number = parseInt(card.localId);
				const category: string = card.category;

				if (!isCategory(category)) {
					throw Error('Invalid category');
				}

				return { quantity, name, tcgOnline, localId, category };
			}),
		);

	const pokemon: LimitlessCard[] = limitlessCardsWithCategory.filter(
		(card) => card.category === CATEGORY.POKEMON,
	);
	const trainer: LimitlessCard[] = limitlessCardsWithCategory.filter(
		(card) => card.category === CATEGORY.TRAINER,
	);
	const energy: LimitlessCard[] = limitlessCardsWithCategory.filter(
		(card) => card.category === CATEGORY.ENERGY,
	);

	return { name, pokemon, trainer, energy };
}
