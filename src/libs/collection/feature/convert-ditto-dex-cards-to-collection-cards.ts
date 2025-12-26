import TCGdex, { Query, type Card, type CardResume } from '@tcgdex/sdk';
import {
	VARIANT,
	type DittoDexCard,
} from '../../ditto-dex/model/ditto-dex-card';
import type { CollectionCard } from '../model/collection-card';
import type { Variants } from '../model/variants';

interface ConvetDittoDexCardsToCollectionCardsParams {
	dittoDexCards: DittoDexCard[];
	tcgDex: TCGdex;
}

export async function convetDittoDexCardsToCollectionCards({
	dittoDexCards,
	tcgDex,
}: ConvetDittoDexCardsToCollectionCardsParams): Promise<CollectionCard[]> {
	const collectionCards: CollectionCard[] = await Promise.all(
		dittoDexCards.map(async (dittoDexCard) => {
			const quantity: number = dittoDexCard.qty;

			const localId: string = dittoDexCard.number.toString();
			let setName: string = dittoDexCard.setName;

			switch (setName) {
				case 'Scarlet & Violet Black Star Promos':
					setName = 'SVP Black Star Promos';
			}

			const cardResumes: CardResume[] = await tcgDex.card.list(
				Query.create().like('localId', localId).like('set.name', setName),
			);

			const cardResume: CardResume | undefined = cardResumes[0];

			if (!cardResume) {
				throw Error(`Card not found, localId: ${localId}, setName: ${setName}`);
			}

			const cardId: string = cardResume.id;

			const card: Card | null = await tcgDex.card.get(cardId);

			if (!card) {
				throw Error(`Card not found`);
			}

			const variants: Variants | undefined = card.variants;

			if (!variants) {
				throw Error('Variants not found');
			}

			if (dittoDexCard.variant === VARIANT.REVERSE_HOLO) {
				return {
					_id: card.id,
					variants: {
						reverse: quantity,
					},
				};
			}

			if (variants.normal) {
				return {
					_id: card.id,
					variants: {
						normal: quantity,
					},
				};
			}

			if (variants.holo) {
				return {
					_id: card.id,
					variants: {
						holo: quantity,
					},
				};
			}

			if (variants.reverse) {
				return {
					_id: card.id,
					variants: {
						reverse: quantity,
					},
				};
			}

			if (variants.wPromo) {
				return {
					_id: card.id,
					variants: {
						wPromo: quantity,
					},
				};
			}

			if (variants.firstEdition) {
				return {
					_id: card.id,
					variants: {
						firstEdition: quantity,
					},
				};
			}

			throw Error('Variant not found');
		}),
	);

	const emptyCollectionCardMap: Map<string, CollectionCard> = new Map();

	const collectionCardMap: Map<string, CollectionCard> = collectionCards.reduce(
		(collectionCardMap, card) => {
			const oldCollectionCard: CollectionCard | undefined =
				collectionCardMap.get(card._id);

			if (oldCollectionCard === undefined) {
				collectionCardMap.set(card._id, card);
				return collectionCardMap;
			}

			const oldVariants: CollectionCard['variants'] =
				oldCollectionCard.variants;
			const oldFirstEdition: number = oldVariants.firstEdition ?? 0;
			const oldHolo: number = oldVariants.holo ?? 0;
			const oldNormal: number = oldVariants.normal ?? 0;
			const oldReverse: number = oldVariants.reverse ?? 0;
			const oldWpromo: number = oldVariants.wPromo ?? 0;

			const newVariants: CollectionCard['variants'] = card.variants;
			const newFirstEdition: number = newVariants.firstEdition ?? 0;
			const newHolo: number = newVariants.holo ?? 0;
			const newNormal: number = newVariants.normal ?? 0;
			const newReverse: number = newVariants.reverse ?? 0;
			const newWpromo: number = newVariants.wPromo ?? 0;

			const variants: CollectionCard['variants'] = {
				firstEdition: oldFirstEdition + newFirstEdition,
				holo: oldHolo + newHolo,
				normal: oldNormal + newNormal,
				reverse: oldReverse + newReverse,
				wPromo: oldWpromo + newWpromo,
			};

			if (variants.firstEdition === 0) {
				delete variants.firstEdition;
			}
			if (variants.holo === 0) {
				delete variants.holo;
			}
			if (variants.normal === 0) {
				delete variants.normal;
			}
			if (variants.reverse === 0) {
				delete variants.reverse;
			}
			if (variants.wPromo === 0) {
				delete variants.wPromo;
			}

			const mergedCollectionCard: CollectionCard = {
				_id: card._id,
				variants,
			};

			collectionCardMap.set(card._id, mergedCollectionCard);

			return collectionCardMap;
		},
		emptyCollectionCardMap,
	);

	return collectionCardMap.values().toArray();
}
