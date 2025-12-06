import { parseEnergyType } from '../../prebuild/feature/parse-energy-type';
import {
	ENERGY_TYPES,
	ENERGY_TYPE_LOCAL_ID_CODE_MAP,
	type EnergyType,
} from '../../prebuild/model/energy';
import type { LimitlessDeck } from '../model/limitless-deck';

const QUANTITY_CONVERSION_STRING =
	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQXYZ' as const satisfies string;

export function convertQuantityToCharacter(quantity: number): string {
	const character: string = QUANTITY_CONVERSION_STRING.charAt(quantity);

	if (character === '') {
		return QUANTITY_CONVERSION_STRING.charAt(
			QUANTITY_CONVERSION_STRING.length - 1,
		);
	}

	return character;
}

export async function converLimitlessDeckToImportString(
	limitlessDeck: LimitlessDeck,
): Promise<string> {
	const cardCodes: string[] = limitlessDeck.pokemon
		.concat(limitlessDeck.trainer)
		.map((limitlessCard) => {
			const region: string = '0';
			const count: string = convertQuantityToCharacter(limitlessCard.quantity);
			const setAbbriviationLenght: string = convertQuantityToCharacter(
				limitlessCard.tcgOnline.length,
			);
			const localIdLength: string = convertQuantityToCharacter(
				limitlessCard.localId.toString().length,
			);
			const setAbbriviation: string = limitlessCard.tcgOnline;
			const localId: string = limitlessCard.localId.toString();

			return [
				region,
				count,
				setAbbriviationLenght,
				localIdLength,
				setAbbriviation,
				localId,
			].join('');
		});

	const energyCardCodes: string[] = limitlessDeck.energy.map(
		(limitlessCard) => {
			const region: string = '0';
			const count: string = convertQuantityToCharacter(limitlessCard.quantity);
			const setAbbriviationLenght: string = convertQuantityToCharacter(
				limitlessCard.tcgOnline.length,
			);
			const localIdLength: string = '1';
			const setAbbriviation: string = limitlessCard.tcgOnline;
			const energyType: EnergyType =
				parseEnergyType(limitlessCard.name) ?? ENERGY_TYPES.FIRE;
			const localId: string = ENERGY_TYPE_LOCAL_ID_CODE_MAP[energyType];

			return [
				region,
				count,
				setAbbriviationLenght,
				localIdLength,
				setAbbriviation,
				localId,
			].join('');
		},
	);

	return `1${cardCodes.concat(energyCardCodes).join('')}`;
}
