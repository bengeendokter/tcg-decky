import type { LimitlessCard } from '../model/limitless-deck';

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

export async function converLimitlessCardsToImportString(
	limitlessCards: LimitlessCard[],
): Promise<string> {
	const cardCodes: string[] = limitlessCards.map((limitlessCard) => {
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

	return `1${cardCodes.join('')}`;
}
