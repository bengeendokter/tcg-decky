import TCGdex, { type Card, type CardResume, Query } from '@tcgdex/sdk';
import type {
	PrebuildCard,
	PrebuildDeck,
	PrebuildSetCardWithQuantity,
} from '../../prebuild/model/prebuild-deck.ts';
import type { CollectionCard, CollectionCardDeck } from '../model/collection-card.ts';

const tcgdex = new TCGdex('en');

interface Variants {
	normal?: boolean;
	reverse?: boolean;
	holo?: boolean;
	wPromo?: boolean;
	firstEdition?: boolean;
}

export async function convertPrebuildToCollectionCards({
	cards: prebuildCards,
	name,
}: PrebuildDeck): Promise<CollectionCardDeck> {
	const setCardsWithQuantity: PrebuildSetCardWithQuantity[] = prebuildCards.filter(
		(cardsWithQuantity): cardsWithQuantity is PrebuildSetCardWithQuantity => {
			const card: PrebuildCard = cardsWithQuantity.card;

			return typeof card !== 'string';
		},
	);

	const cards: CollectionCard[] = await Promise.all(
		setCardsWithQuantity.map(async (setCardWithQuantity) => {
			const { card: setCard, quantity } = setCardWithQuantity;

			// if setName end with Promo, replace it with Black Star Promos
			const unvalidatedSetName: string = setCard.setName;

			const setName: string = unvalidatedSetName.endsWith('Promo')
				? unvalidatedSetName.replace('Promo', 'Black Star Promos')
				: unvalidatedSetName;

			const cardResumes: CardResume[] = await tcgdex.card.list(
				Query.create()
					.like('localId', setCard.localId.toString())
					.like('set.name', setName),
			);

			const cardResume: CardResume | undefined = cardResumes[0];

			if (!cardResume) {
				throw Error(`Card not found: ${setCard.setName} #${setCard.localId}`);
			}

			const cardId: string = cardResume.id;

			const card: Card | null = await tcgdex.card.get(cardId);

			if (!card) {
				throw Error('Card not found');
			}

			const variants: Variants | undefined = card.variants;

			if (!variants) {
				throw Error('Variants not found');
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

	return {
		name,
		cards,
	}
}
