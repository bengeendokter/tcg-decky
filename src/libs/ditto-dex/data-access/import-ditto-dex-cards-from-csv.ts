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
			.split(',')
			.map((value) => value.trim().replaceAll('"', ''));

		if (lineValues.length !== 10) {
			throw Error(
				`Invalid CSV format: expected 10 values per line, got ${lineValues.length} values. Line example: ${line}`,
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

		const setName: string | undefined = lineValues[4];

		if (setName === undefined) {
			throw Error('setName not found');
		}

		const variant: string | undefined = lineValues[5];

		if (variant === undefined) {
			throw Error('variant not found');
		}

		if (!isVariant(variant)) {
			throw Error(`${variant} is not a valid variant`);
		}

		let qty: number | string | undefined = lineValues[6];

		if (qty === undefined) {
			throw Error('qty not found');
		}

		qty = parseInt(qty);

		const currency: string | undefined = lineValues[7];

		if (currency === undefined) {
			throw Error('currency not found');
		}

		if (!isCurrency(currency)) {
			throw Error(`${currency} is not a valid currency`);
		}

		let value: number | string | undefined = lineValues[8];

		if (value === undefined) {
			throw Error('value not found');
		}

		value = parseInt(value);

		let totalValue: number | string | undefined = lineValues[9];

		if (totalValue === undefined) {
			throw Error('totalValue not found');
		}

		totalValue = parseInt(totalValue);

		return {
			id,
			name,
			pokedexNumber,
			number,
			setName,
			variant,
			qty,
			currency,
			value,
			totalValue,
		};
	});
}
