import type { PrebuildDeck } from '../../prebuild/model/prebuild-deck.ts';
import type { LimitlessDeck } from '../model/limitless-deck.ts';
import TCGdex, { type Card } from '@tcgdex/sdk';

const tcgdex = new TCGdex('en');

export async function convertPrebuildToLimitlessDeck(
	prebuildDeck: PrebuildDeck,
): Promise<void> {
	const card: Card | null = await tcgdex.card.get('swsh3-136');

	if (!card) {
		throw new Error('Card not found');
	}

	console.log(card.name);
}
