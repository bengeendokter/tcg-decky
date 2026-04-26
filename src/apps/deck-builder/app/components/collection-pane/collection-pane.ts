import { Component, input, output, OutputEmitterRef, type InputSignal } from '@angular/core';
import { Field, type FieldTree } from '@angular/forms/signals';
import { TcgCard } from '../tcg-card/tcg-card';
import {
	ALL,
	isPokemonType,
	POKEMON_TYPES,
	type All,
	type PokemonType,
} from '../../../../../libs/deck-builder/model/pokemon-type';
import type { TcgDexCollectionCard } from '../../../../../libs/deck-builder/model/tcg-dex-collection-card';
import { getQuantitySum } from '../../../../../libs/deck-builder/util/get-quantity-sum';
import openInFullIcon from '@material-symbols/svg-400/rounded/open_in_full.svg';
import closeFullscreenIcon from '@material-symbols/svg-400/rounded/close_fullscreen.svg';
import { IconComponent } from '../icon/icon.component';

@Component({
	selector: 'collection-pane',
	imports: [Field, TcgCard, IconComponent],
	templateUrl: './collection-pane.html',
	styleUrl: './collection-pane.css',
})
export class CollectionPane {
	public readonly sortedTcgDexCollectionCards: InputSignal<TcgDexCollectionCard[]> =
		input.required();
	public readonly searchForm: InputSignal<FieldTree<string>> = input.required();
	public readonly inRotationFilterForm: InputSignal<FieldTree<boolean>> = input.required();
	public readonly pokemonTypeFilterForm: InputSignal<FieldTree<PokemonType | All>> =
		input.required();
	public readonly collectionFullscreen: InputSignal<boolean> = input.required();
	protected readonly openInFullIcon: string = openInFullIcon;
	protected readonly closeFullscreenIcon: string = closeFullscreenIcon;
	public readonly toggleFullscreen: OutputEmitterRef<void> = output();
	public readonly openCardDetail: OutputEmitterRef<TcgDexCollectionCard> = output();

	protected readonly POKEMON_TYPES: typeof POKEMON_TYPES = POKEMON_TYPES;
	protected readonly ALL: All = ALL;
	protected readonly getQuantitySum: typeof getQuantitySum = getQuantitySum;

	protected handelSelectionChange(event: Event): void {
		const target: EventTarget | null = event.target;

		if (target === null) {
			return;
		}

		if (!(target instanceof HTMLSelectElement)) {
			return;
		}

		const value: string = target.value;

		if (!(isPokemonType(value) || value === ALL)) {
			return;
		}

		this.updatePokemonTypeFilterForm(value);
	}

	private updatePokemonTypeFilterForm(value: PokemonType | All): void {
		this.pokemonTypeFilterForm()().setControlValue(value);
	}
}
