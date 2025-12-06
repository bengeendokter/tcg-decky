import { parseEnergyType } from './parse-energy-type';
import {
	ENERGY_TYPE_PREBUILD_CARD_MAP,
	type EnergyType,
} from '../model/energy';
import type { PrebuildCard } from '../model/prebuild-deck';
import { type Title, isEnergyTitle } from '../model/title';
import { parsePrebuildSetCard } from './parse-prebuild-set-card';

export function parsePrebuildCard(title: Title): PrebuildCard {
	if (isEnergyTitle(title)) {
		const energyType: EnergyType | undefined = parseEnergyType(title);

		if (!energyType) {
			throw Error(`Unable to parse energy type from title: ${title}`);
		}

		return ENERGY_TYPE_PREBUILD_CARD_MAP[energyType];
	}

	return parsePrebuildSetCard(title);
}
