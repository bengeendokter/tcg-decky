import { ENERGY_TYPES, type EnergyCard } from "./energy.ts";

export type EnergyTitle = `${EnergyCard} (TCG)`;

export function isEnergyTitle(text: string): text is EnergyTitle {
	return Object.values(ENERGY_TYPES)
		.map((energyType): EnergyTitle => `Basic ${energyType} Energy (TCG)`)
		.some((energyTitle) => {
			return text === energyTitle;
		});
}

export type CardTitle = `${string} (${string} ${number})`;

export function isCardTitle(text: string): text is CardTitle {
	return /.+ \(.+ \d+\)$/.test(text);
}

export type Title = CardTitle | EnergyTitle;

export function isTitle(text: string): text is Title {
	return isCardTitle(text) || isEnergyTitle(text);
}
