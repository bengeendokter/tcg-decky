import type {
	PrebuildCard,
	PrebuildDeck,
	PrebuildEnergyCardWithQuantity,
	PrebuildSetCardWithQuantity,
} from '../../prebuild/model/prebuild-deck.ts';
import {
	CATEGORY,
	isCategory,
	type LimitlessCard,
	type LimitlessCardWithCategory,
	type LimitlessDeck,
} from '../model/limitless-deck.ts';
import TCGdex, {
	Query,
	type Card,
	type CardResume,
	type Set,
} from '@tcgdex/sdk';

const tcgdex = new TCGdex('en');

export async function convertPrebuildToLimitlessDeck({
	name,
	cards,
}: PrebuildDeck): Promise<LimitlessDeck> {
	const setCardsWithQuantity: PrebuildSetCardWithQuantity[] = cards.filter(
		(cardsWithQuantity): cardsWithQuantity is PrebuildSetCardWithQuantity => {
			const card: PrebuildCard = cardsWithQuantity.card;

			return typeof card !== 'string';
		},
	);

	const energyCardsWithQuantity: PrebuildEnergyCardWithQuantity[] =
		cards.filter(
			(
				cardsWithQuantity,
			): cardsWithQuantity is PrebuildEnergyCardWithQuantity => {
				const card: PrebuildCard = cardsWithQuantity.card;

				return typeof card === 'string';
			},
		);

	const limitlessCardsWithCategory: LimitlessCardWithCategory[] =
		await Promise.all(
			setCardsWithQuantity.map(async (setCardWithQuantity) => {
				const { card: setCard, quantity } = setCardWithQuantity;

				const cardResumes: CardResume[] = await tcgdex.card.list(
					Query.create()
						.like('localId', setCard.localId.toString())
						.like('set.name', setCard.setName),
				);

				const cardResume: CardResume | undefined = cardResumes[0];

				if (!cardResume) {
					throw Error('Card not found');
				}

				const cardId: string = cardResume.id;

				const card: Card | null = await tcgdex.card.get(cardId);

				if (!card) {
					throw Error('Card not found');
				}

				const name: string = card.name;
				const localId: number = parseInt(card.localId);
				const category: string = card.category;

				if (!isCategory(category)) {
					throw Error('Invalid category');
				}

				const set: Set | null = await tcgdex.set.get(card.set.id);

				if (!set) {
					throw Error('Set not found');
				}

				const tcgOnline: string | undefined = set.tcgOnline;

				if (!tcgOnline) {
					throw Error('Set TCG Online code not found');
				}

				return {
					category,
					quantity,
					name,
					tcgOnline,
					localId,
				};
			}),
		);

	const pokemon: LimitlessCard[] = limitlessCardsWithCategory.filter(
		(limitlessCardWithCategory) => {
			return limitlessCardWithCategory.category === CATEGORY.POKEMON;
		},
	);
	// TODO Check if item and supporter cards are handled correctly
	const trainer: LimitlessCard[] = limitlessCardsWithCategory.filter(
		(limitlessCardWithCategory) => {
			return limitlessCardWithCategory.category === CATEGORY.TRAINER;
		},
	);
	// TODO handle energy cards properly
	const energy: LimitlessCard[] = [];

	return {
		name,
		pokemon,
		trainer,
		energy,
	};
}
