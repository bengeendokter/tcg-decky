import TCGdex, { type Card } from '@tcgdex/sdk';
import {
	VARIANT,
	type DittoDexCard,
} from '../../ditto-dex/model/ditto-dex-card.ts';
import type { CollectionCard } from '../model/collection-card.ts';
import type { Variants } from '../model/variants.ts';

const tcgdex = new TCGdex('en');

export async function convetDittoDexCardsToCollectionCards(
	dittoDexCards: DittoDexCard[],
): Promise<CollectionCard[]> {
	return await Promise.all(
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

			const card: Card | null = await tcgdex.card.get(_id);

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
}
