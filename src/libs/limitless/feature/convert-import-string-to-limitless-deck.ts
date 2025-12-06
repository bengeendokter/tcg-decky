import { ArkErrors, Type, type } from 'arktype';
import {
	CATEGORY,
	isCategory,
	type LimitlessCard,
	type LimitlessCardWithCategory,
	type LimitlessDeck,
} from '../model/limitless-deck';
import {
	ENERGY_TYPE_PREBUILD_CARD_MAP,
	isEnergyTypeLocalIdCode,
	LOCAL_ID_CODE_ENERGY_TYPE_MAP,
} from '../../prebuild/model/energy';
import type TCGdex from '@tcgdex/sdk';
import { Query, type Card, type CardResume, type SetResume } from '@tcgdex/sdk';
import type { SetWithAbbreviation } from '../../tcg-dex/model/set-with-abbreviation';

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

export interface ConvertImportStringToLimitlessDecksParams {
	importString: string;
	tcgDex: TCGdex;
}

export async function convertImportStringToLimitlessDecks({
	importString,
	tcgDex,
}: ConvertImportStringToLimitlessDecksParams): Promise<LimitlessDeck> {
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
				const localIdString: string = importString.substring(
					importStringIndex,
					importStringIndex + localIdLength,
				);

				const localId: number = isEnergyTypeLocalIdCode(localIdString)
					? ENERGY_TYPE_PREBUILD_CARD_MAP[
							LOCAL_ID_CODE_ENERGY_TYPE_MAP[localIdString]
						].localId
					: parseInt(localIdString);

				temporaryLimitlessCardParts = {
					...temporaryLimitlessCardParts,
					localId,
				};

				const limitlessCardParts: LimitlessCardParts | ArkErrors =
					limitlessCardPartsValidator(temporaryLimitlessCardParts);

				if (limitlessCardParts instanceof ArkErrors) {
					throw Error('Can not parse import string');
				}

				limitlessCardPartsList.push(limitlessCardParts);

				importStringIndex += localIdLength;

				temporaryLimitlessCardParts = {};
				setAbbriviationLenght = 0;
				localIdLength = 0;
				break;
			default:
				currentImportStringPart satisfies never;
		}

		importStringPartIndex =
			(importStringPartIndex + 1) % IMPORT_STRING_PARTS.length;
	}

	const limitlessCardsWithCategory: LimitlessCardWithCategory[] =
		await Promise.all(
			limitlessCardPartsList.map(async (limitlessCardParts) => {
				return await limitlessCardPartsToLimitlessCard({
					limitlessCardParts,
					tcgDex,
				});
			}),
		);

	const pokemon: LimitlessCard[] = limitlessCardsWithCategory.filter(
		(card) => card.category === CATEGORY.POKEMON,
	);
	const trainer: LimitlessCard[] = limitlessCardsWithCategory.filter(
		(card) => card.category === CATEGORY.TRAINER,
	);
	const energy: LimitlessCard[] = limitlessCardsWithCategory.filter(
		(card) => card.category === CATEGORY.ENERGY,
	);

	return { name: 'Imported Deck', energy, pokemon, trainer };
}

export interface LimitlessCardPartsToLimitlessCardParams {
	limitlessCardParts: LimitlessCardParts;
	tcgDex: TCGdex;
}

export async function limitlessCardPartsToLimitlessCard({
	limitlessCardParts,
	tcgDex,
}: LimitlessCardPartsToLimitlessCardParams): Promise<LimitlessCardWithCategory> {
	const { localId, setAbbriviation, quantity }: LimitlessCardParts =
		limitlessCardParts;

	// handle exceptions
	const reverseExeptionMap: Map<string, string> = new Map([['SVI', 'SV']]);

	const setResumes: SetResume[] = await tcgDex.set.list(
		Query.create().like(
			'abbreviation.official',
			reverseExeptionMap.get(setAbbriviation) ?? setAbbriviation,
		),
	);

	const setResume: SetResume | undefined = setResumes[0];

	if (!setResume) {
		throw Error('Set not found');
	}

	const set: SetWithAbbreviation | null = await tcgDex.set.get(setResume.id);

	if (!set) {
		throw Error('Set not found');
	}

	const cardResumes: CardResume[] = await tcgDex.card.list(
		Query.create().like('localId', localId.toString()).equal('set.id', set.id),
	);

	const cardResume: CardResume | undefined = cardResumes[0];

	if (!cardResume) {
		throw Error(`Card not found: ${setAbbriviation} #${localId}`);
	}

	const cardId: string = cardResume.id;

	const card: Card | null = await tcgDex.card.get(cardId);

	if (!card) {
		throw Error('Card not found');
	}

	const name: string = card.name;
	const category: string = card.category;

	if (!isCategory(category)) {
		throw Error('Invalid category');
	}

	const abbreviation: string | undefined = set?.abbreviation?.official;
	let tcgOnline: string | undefined = set.tcgOnline ?? abbreviation;

	if (!tcgOnline) {
		throw Error(
			`Set TCG Online code not found for ${set.name} with ID ${set.id} and abbreviation ${abbreviation}`,
		);
	}

	const exeptionMap: Map<string, string> = new Map([
		// ['SVP', 'PR-SV'],
		['SV', 'SVI'],
	]);

	tcgOnline = exeptionMap.get(tcgOnline) ?? tcgOnline;

	return { localId, quantity, name, category, tcgOnline };
}
