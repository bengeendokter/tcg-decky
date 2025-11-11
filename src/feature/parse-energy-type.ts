import { ENERGY_TYPES, type EnergyType } from "../model/energy.ts";

export function parseEnergyType(text: string): EnergyType | undefined {
	const energyTypes: EnergyType[] = Object.values(ENERGY_TYPES);
	for (const energyType of energyTypes) {
		if (text.includes(energyType)) {
			return energyType;
		}
	}

	return undefined;
}
