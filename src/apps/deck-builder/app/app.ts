import {
	Component,
	computed,
	inject,
	signal,
	type ResourceRef,
	type Signal,
	type WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Collection } from '../../../libs/deck-builder/data-access/collection.ts';
import type { CollectionCard } from '../../../libs/collection/model/collection-card.ts';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.css',
})
export class App {
	private readonly collection: Collection = inject(Collection);
	private readonly getAllCardsRecource: ResourceRef<CollectionCard[] | undefined> =
		this.collection.getAllCardsRecource;

	protected cards: Signal<CollectionCard[]> = computed(() => {
		const getAllCardsRecource: ResourceRef<CollectionCard[] | undefined> =
			this.getAllCardsRecource;
		if (!getAllCardsRecource.hasValue()) {
			return [];
		}

		return getAllCardsRecource.value();
	});

	protected async getAllCards() {
		this.getAllCardsRecource.reload();
	}
}
