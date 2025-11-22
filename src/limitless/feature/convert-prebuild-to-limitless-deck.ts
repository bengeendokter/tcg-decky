import { parseEnergyType } from '../../prebuild/feature/parse-energy-type.ts';
import {
	energyTypeLocalIdMap,
	type EnergyType,
} from '../../prebuild/model/energy.ts';
import type {
	PrebuildCard,
	PrebuildDeck,
	PrebuildEnergyCardWithQuantity,
	PrebuildSetCardWithQuantity,
} from '../../prebuild/model/prebuild-deck.ts';
import type { SetWithAbbreviation } from '../../tcg-dex/model/set-with-abbreviation.ts';
import {
	CATEGORY,
	isCategory,
	type LimitlessCard,
	type LimitlessCardWithCategory,
	type LimitlessDeck,
} from '../model/limitless-deck.ts';
import TCGdex, { Query, type Card, type CardResume } from '@tcgdex/sdk';

interface ConvertPrebuildToLimitlessDeckParams {
	prebuildDeck: PrebuildDeck;
	tcgDex: TCGdex;
}

export async function convertPrebuildToLimitlessDeck({
	prebuildDeck: { name, cards },
	tcgDex,
}: ConvertPrebuildToLimitlessDeckParams): Promise<LimitlessDeck> {
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

				// if setName end with Promo, replace it with Black Star Promos
				const unvalidatedSetName: string = setCard.setName;

				const setName: string = unvalidatedSetName.endsWith('Promo')
					? unvalidatedSetName.replace('Promo', 'Black Star Promos')
					: unvalidatedSetName;

				const cardResumes: CardResume[] = await tcgDex.card.list(
					Query.create()
						.like('localId', setCard.localId.toString())
						.like('set.name', setName),
				);

				const cardResume: CardResume | undefined = cardResumes[0];

				if (!cardResume) {
					throw Error(`Card not found: ${setCard.setName} #${setCard.localId}`);
				}

				const cardId: string = cardResume.id;

				const card: Card | null = await tcgDex.card.get(cardId);

				if (!card) {
					throw Error('Card not found');
				}

				const name: string = card.name;
				const localId: number = parseInt(card.localId);
				const category: string = card.category;

				if (!isCategory(category)) {
					throw Error('Invalid category');
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
	const trainer: LimitlessCard[] = limitlessCardsWithCategory.filter(
		(limitlessCardWithCategory) => {
			return limitlessCardWithCategory.category === CATEGORY.TRAINER;
		},
	);
	const energy: LimitlessCard[] = energyCardsWithQuantity.map(
		(energyCardWithQuantity) => {
			const { card: name, quantity } = energyCardWithQuantity;

			const energyType: EnergyType | undefined = parseEnergyType(name);

			if (!energyType) {
				throw Error('Invalid energy type');
			}

			// TODO remove these hardcoded values when EnergyCard type is updated with these extra fields
			const tcgOnline: string = 'SVE';
			const localId: number | undefined = energyTypeLocalIdMap.get(energyType);

			if (!localId) {
				throw Error('Energy local ID not found');
			}

			return {
				name,
				quantity,
				tcgOnline,
				localId,
			};
		},
	);

	return {
		name,
		pokemon,
		trainer,
		energy,
	};
}
