import { ArkError, ArkErrors, Type, type } from 'arktype';
import type { LimitlessCard, LimitlessDeck } from '../model/limitless-deck';

const IMPORT_STRING_PART = {
	REGION: 'region',
	COUNT: 'count',
	SET_ABBRIVIATION_LENGHT: 'set_abbriviation_lenght',
	LOCAL_ID_LENGHT: 'local_id_lenght',
	SET_ABBRIVIATION: 'set_abbriviation',
	LOCALE_ID: 'local_id',
} as const satisfies Record<Uppercase<string>, string>;

type ImportStringPart =
	(typeof IMPORT_STRING_PART)[keyof typeof IMPORT_STRING_PART];

const IMPORT_STRING_PARTS = [
	IMPORT_STRING_PART.REGION,
	IMPORT_STRING_PART.COUNT,
	IMPORT_STRING_PART.SET_ABBRIVIATION_LENGHT,
	IMPORT_STRING_PART.LOCAL_ID_LENGHT,
	IMPORT_STRING_PART.SET_ABBRIVIATION,
	IMPORT_STRING_PART.LOCALE_ID,
] as const satisfies ImportStringPart[];

interface LimitlessCardParts {
	quantity: number;
	setAbbriviation: string;
	localId: number;
}

const limitlessCardPartsValidator: Type<LimitlessCardParts> = type({
	quantity: 'number',
	setAbbriviation: 'string',
	localId: 'number',
});

type TemporaryLimitlessCardParts = Partial<LimitlessCardParts>;

const QUANTITY_CONVERSION_STRING =
	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQXYZ' as const satisfies string;

export function convertCharacterToQuantity(character: string): number {
	return QUANTITY_CONVERSION_STRING.indexOf(character);
}

export async function convertImportStringToLimitlessDecks(
	importString: string,
): Promise<LimitlessDeck> {
	let importStringIndex: number = 1;
	let importStringPartIndex: number = 0;
	let temporaryLimitlessCardParts: TemporaryLimitlessCardParts = {};
	let setAbbriviationLenght: number = 0;
	let localIdLength: number = 0;
	const limitlessCardPartsList: LimitlessCardParts[] = [];

	while (importStringIndex <= importString.length) {
		const currentImportStringPart: ImportStringPart =
			IMPORT_STRING_PARTS[importStringPartIndex] ?? IMPORT_STRING_PART.REGION;

		switch (currentImportStringPart) {
			case IMPORT_STRING_PART.REGION:
				importStringIndex += 1;
				break;
			case IMPORT_STRING_PART.COUNT:
				const quantityCharacter: string =
					importString.charAt(importStringIndex);

				const quantity: number = convertCharacterToQuantity(quantityCharacter);

				temporaryLimitlessCardParts = {
					quantity,
				};
				importStringIndex += 1;
				break;
			case IMPORT_STRING_PART.SET_ABBRIVIATION_LENGHT:
				const setAbbriviationLenghtCharacter: string =
					importString.charAt(importStringIndex);

				setAbbriviationLenght = convertCharacterToQuantity(
					setAbbriviationLenghtCharacter,
				);
				importStringIndex += 1;
				break;
			case IMPORT_STRING_PART.LOCAL_ID_LENGHT:
				const localIdLengthCharacter: string =
					importString.charAt(importStringIndex);

				localIdLength = convertCharacterToQuantity(localIdLengthCharacter);
				importStringIndex += 1;
				break;
			case IMPORT_STRING_PART.SET_ABBRIVIATION:
				const setAbbriviation: string = importString.substring(
					importStringIndex,
					importStringIndex + setAbbriviationLenght,
				);

				temporaryLimitlessCardParts = {
					...temporaryLimitlessCardParts,
					setAbbriviation,
				};
				importStringIndex += setAbbriviationLenght;
				break;
			case IMPORT_STRING_PART.LOCALE_ID:
				const localId: number = parseInt(
					importString.substring(
						importStringIndex,
						importStringIndex + localIdLength,
					),
				);

				temporaryLimitlessCardParts = {
					...temporaryLimitlessCardParts,
					localId,
				};

				const limitlessCardParts: LimitlessCardParts | ArkErrors =
					limitlessCardPartsValidator(temporaryLimitlessCardParts);

				if (limitlessCardParts) {
					throw Error('Can not parse import string');
				}

				limitlessCardPartsList.push(limitlessCardParts);

				temporaryLimitlessCardParts = {};
				setAbbriviationLenght = 0;
				localIdLength = 0;

				importStringIndex += localIdLength;
				break;
			default:
				currentImportStringPart satisfies never;
		}

		importStringPartIndex =
			(importStringPartIndex + 1) % IMPORT_STRING_PARTS.length;
	}

	const limitlessCards: LimitlessCard[] = limitlessCardPartsList.map(
		(limitlessCardParts) => {
			return limitlessCardParts;
		},
	);

	return { name: '', energy: [], pokemon: [], trainer: [] };
}
