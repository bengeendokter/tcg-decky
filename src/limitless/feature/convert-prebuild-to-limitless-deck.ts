import type { PrebuildDeck } from '../../prebuild/model/prebuild-deck.ts';
import type { LimitlessCard, LimitlessDeck } from '../model/limitless-deck.ts';
import TCGdex, { Query, type Card, type CardResume } from '@tcgdex/sdk';

const tcgdex = new TCGdex('en');

export async function convertPrebuildToLimitlessDeck({
	name,
	cards,
}: PrebuildDeck): Promise<LimitlessDeck> {
	const card: CardResume[] = await tcgdex.card.list(
		Query.create().like('localId', '136').like('set.name', 'Darkness Ablaze'),
	);

	console.log('length', card.length);
	console.log('name', card[0]?.name);

	const pokemon: LimitlessCard[] = [];
	const trainer: LimitlessCard[] = [];
	const energy: LimitlessCard[] = [];

	return {
		name,
		pokemon,
		trainer,
		energy,
	};
}
