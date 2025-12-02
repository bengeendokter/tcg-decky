import TCGdex, { type Card } from '@tcgdex/sdk';
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
			const dittoDexCardId: string = dittoDexCard.id;
			const setNumberStartIndex: number = dittoDexCardId.search(/\d/);

			if (setNumberStartIndex === -1) {
				throw Error('Invalid dittoDexCardId');
			}

			const [setAbriviationWithSetNumber, cardNumber]: string[] =
				dittoDexCardId.split('-');

			if (
				setAbriviationWithSetNumber === undefined ||
				cardNumber === undefined
			) {
				throw Error('Invalid dittoDexCardId');
			}

			const setAbriviation: string = setAbriviationWithSetNumber.substring(
				0,
				setNumberStartIndex,
			);
			const setNumber: string =
				setAbriviationWithSetNumber.substring(setNumberStartIndex);

			if (setAbriviation === '' || setNumber === '') {
				throw Error('Invalid dittoDexCardId');
			}

			const _id: string = `${setAbriviation}${setNumber.padStart(2, '0')}-${cardNumber.padStart(3, '0')}`;
			const quantity: number = dittoDexCard.qty;

			const card: Card | null = await tcgDex.card.get(_id);

			if (!card) {
				throw Error(`Card not found, id: ${_id}`);
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
