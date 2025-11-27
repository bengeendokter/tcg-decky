import * as fs from 'fs';
import type { LimitlessCard, LimitlessDeck } from '../model/limitless-deck.ts';

export interface ExportLimitlessDeckToTxtParams {
	limitlessDeck: LimitlessDeck;
	outputDirectory: string;
}

interface LimitlessCardsToCategoryHeaderLineParams {
	limitlessCards: LimitlessCard[];
	category: string;
}

function limitlessCardsToCategoryHeaderLine({
	limitlessCards,
	category,
}: LimitlessCardsToCategoryHeaderLineParams): string {
	const quantityTotal: number = limitlessCards.reduce(
		(acc, card) => acc + card.quantity,
		0,
	);
	return `${category}: ${quantityTotal}`;
}

function limitlessCardToTxtLine(limitlessCard: LimitlessCard): string {
	return `${limitlessCard.quantity} ${limitlessCard.name} ${limitlessCard.tcgOnline} ${limitlessCard.localId}`;
}

export function exportLimitlessDeckToTxt({
	limitlessDeck,
	outputDirectory,
}: ExportLimitlessDeckToTxtParams): void {
	const { pokemon, trainer, energy } = limitlessDeck;
	const deckFileName = `${outputDirectory}/${limitlessDeck.name.replaceAll(' ', '_')}.txt`;

	const pokemonHeaderLine: string = limitlessCardsToCategoryHeaderLine({
		limitlessCards: pokemon,
		category: 'Pokémon',
	});
	const trainerHeaderLine: string = limitlessCardsToCategoryHeaderLine({
		limitlessCards: trainer,
		category: 'Trainer',
	});
	const energyHeaderLine: string = limitlessCardsToCategoryHeaderLine({
		limitlessCards: energy,
		category: 'Energy',
	});

	const pokemonLines: string[] = pokemon.map(limitlessCardToTxtLine);
	const trainerLines: string[] = trainer.map(limitlessCardToTxtLine);
	const energyLines: string[] = energy.map(limitlessCardToTxtLine);

	const txtLines: string[] = [
		pokemonHeaderLine,
		...pokemonLines,
		'',
		trainerHeaderLine,
		...trainerLines,
		'',
		energyHeaderLine,
		...energyLines,
	];
	const txtContent: string = txtLines.join('\n');

	fs.writeFileSync(deckFileName, txtContent, { encoding: 'utf-8' });
}
