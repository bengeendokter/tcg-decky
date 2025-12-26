import * as fs from 'fs';
import {
	isCurrency,
	isVariant,
	type DittoDexCard,
} from '../model/ditto-dex-card';

export function importDittoDexCardsFromCsv(
	csvFilePath: string,
): DittoDexCard[] {
	const csvContent: string = fs.readFileSync(csvFilePath, {
		encoding: 'utf-8',
	});

	const csvLines: string[] = csvContent
		.split('\n')
		.slice(1)
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	return csvLines.map((line) => {
		const lineValues: string[] = line
			.split('","')
			.map((value) => value.trim().replaceAll('"', '').replaceAll(',', '.'));

		if (lineValues.length !== 15) {
			throw Error(
				`Invalid CSV format: expected 15 values per line, got ${lineValues.length} values. Line example: ${line}`,
			);
		}

		const id: string | undefined = lineValues[0];

		if (id === undefined) {
			throw Error('id not found');
		}

		const name: string | undefined = lineValues[1];

		if (name === undefined) {
			throw Error('name not found');
		}

		let pokedexNumber: string | number | undefined = lineValues[2];

		if (pokedexNumber === undefined) {
			throw Error('pokedexNumber not found');
		}

		pokedexNumber = parseInt(pokedexNumber);

		let number: string | number | undefined = lineValues[3];

		if (number === undefined) {
			throw Error('number not found');
		}

		number = parseInt(number);

		const rarity: string | undefined = lineValues[4];

		if (rarity === undefined) {
			throw Error('rarity not found');
		}

		const types: string | undefined = lineValues[5];

		if (types === undefined) {
			throw Error('types not found');
		}

		const subtypes: string | undefined = lineValues[6];

		if (subtypes === undefined) {
			throw Error('subtypes not found');
		}

		const artist: string | undefined = lineValues[7];

		if (artist === undefined) {
			throw Error('artist not found');
		}

		const series: string | undefined = lineValues[8];

		if (series === undefined) {
			throw Error('series not found');
		}

		const setName: string | undefined = lineValues[9];

		if (setName === undefined) {
			throw Error('setName not found');
		}

		const variant: string | undefined = lineValues[10];

		if (variant === undefined) {
			throw Error('variant not found');
		}

		if (!isVariant(variant)) {
			throw Error(`${variant} is not a valid variant`);
		}

		let qty: number | string | undefined = lineValues[11];

		if (qty === undefined) {
			throw Error('qty not found');
		}

		qty = parseInt(qty);

		const currency: string | undefined = lineValues[12];

		if (currency === undefined) {
			throw Error('currency not found');
		}

		if (!isCurrency(currency)) {
			throw Error(`${currency} is not a valid currency`);
		}

		let value: number | string | undefined = lineValues[13];

		if (value === undefined) {
			throw Error('value not found');
		}

		value = parseInt(value);

		let totalValue: number | string | undefined = lineValues[14];

		if (totalValue === undefined) {
			throw Error('totalValue not found');
		}

		totalValue = parseInt(totalValue);

		return {
			id,
			name,
			pokedexNumber,
			number,
			rarity,
			types,
			subtypes,
			artist,
			series,
			setName,
			variant,
			qty,
			currency,
			value,
			totalValue,
		};
	});
}
