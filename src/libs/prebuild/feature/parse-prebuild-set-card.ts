import type { PrebuildSetCard } from '../model/prebuild-deck';
import type { CardTitle } from '../model/title';

export function parsePrebuildSetCard(title: CardTitle): PrebuildSetCard {
	const [name, setAndId]: string[] = title.replace(')', '').split(' (');

	if (!name || !setAndId) {
		throw Error(`Unable to parse set card from title: ${title}`);
	}

	const setName: string = setAndId.split(' ').slice(0, -1).join(' ');
	const localIdText: string | undefined = setAndId.split(' ').at(-1);

	if (!localIdText || setName === ' ') {
		throw Error(`Unable to parse set card from title: ${title}`);
	}

	const localId: number = parseInt(localIdText);

	return {
		name,
		setName,
		localId,
	};
}
