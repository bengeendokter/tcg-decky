import {
	Component,
	input,
	output,
	OutputEmitterRef,
	type InputSignal,
} from '@angular/core';
import { Field, type FieldTree } from '@angular/forms/signals';
import { TcgCard } from '../tcg-card/tcg-card';
import {
	ALL,
	POKEMON_TYPES,
	type All,
	type PokemonType,
} from '../../../../../libs/deck-builder/model/pokemon-type';
import type { TcgDexCollectionCard } from '../../../../../libs/deck-builder/model/tcg-dex-collection-card';
import { getQuantitySum } from '../../../../../libs/deck-builder/util/get-quantity-sum';

@Component({
	selector: 'collection-pane',
	imports: [Field, TcgCard],
	templateUrl: './collection-pane.html',
	styleUrl: './collection-pane.css',
})
export class CollectionPane {
	public readonly sortedTcgDexCollectionCards: InputSignal<
		TcgDexCollectionCard[]
	> = input.required();
	public readonly searchForm: InputSignal<FieldTree<string>> =
		input.required();
	public readonly inRotationFilterForm: InputSignal<FieldTree<boolean>> =
		input.required();
	public readonly pokemonTypeFilterForm: InputSignal<FieldTree<PokemonType | All>> =
		input.required();
	public readonly toggleFullscreen: OutputEmitterRef<void> = output();
	public readonly openCardDetail: OutputEmitterRef<TcgDexCollectionCard> = output();

	protected readonly POKEMON_TYPES: typeof POKEMON_TYPES = POKEMON_TYPES;
	protected readonly ALL: All = ALL;
	protected readonly getQuantitySum: typeof getQuantitySum = getQuantitySum;
}
