import { parseEnergyType } from './parse-energy-type.ts';
import type { EnergyType } from '../model/energy.ts';
import type { PrebuildCard } from '../model/prebuild-deck.ts';
import { type Title, isEnergyTitle } from '../model/title.ts';
import { parsePrebuildSetCard } from './parse-prebuild-set-card.ts';

export function parsePrebuildCard(title: Title): PrebuildCard {
	if (isEnergyTitle(title)) {
		const energyType: EnergyType | undefined = parseEnergyType(title);

		if (!energyType) {
			throw Error(`Unable to parse energy type from title: ${title}`);
		}

		return `Basic ${energyType} Energy`;
	}

	return parsePrebuildSetCard(title);
}
