import type { PrebuildDeck } from '../../prebuild/model/prebuild-deck.ts';
import type { LimitlessCard, LimitlessDeck } from '../model/limitless-deck.ts';
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
	// TODO filter out energies

	const cardResumes: CardResume[] = await tcgdex.card.list(
		Query.create().like('localId', '136').like('set.name', 'Darkness Ablaze'),
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

	const category: string = card.category;

	const set: Set | null = await tcgdex.set.get(card.set.id);

	if (!set) {
		throw Error('Set not found');
	}

	const tcgOnline: string | undefined = set.tcgOnline;

	if (!tcgOnline) {
		throw Error('Set TCG Online code not found');
	}

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
