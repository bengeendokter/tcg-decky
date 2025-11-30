import { Component, inject, signal, type WritableSignal } from '@angular/core';
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
	protected cards: WritableSignal<CollectionCard[] | undefined> =
		signal(undefined);

	protected async getAllCards() {
		const cards: CollectionCard[] = await this.collection.getAllCards();
		this.cards.set(cards);
	}
}
