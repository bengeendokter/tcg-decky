import {
	Component,
	computed,
	inject,
	type ResourceRef,
	type Signal,
	type WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Collection } from '../../../libs/deck-builder/data-access/collection';
import type { CollectionCard } from '../../../libs/collection/model/collection-card';
import { TcgDex } from '../../../libs/deck-builder/data-access/tcg-dex';
import type { Card } from '@tcgdex/sdk';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.html',
	styleUrl: './app.css',
})
export class App {
	private readonly collection: Collection = inject(Collection);
	private readonly tcgDex: TcgDex = inject(TcgDex);
	private readonly getAllCardsResource: ResourceRef<
		CollectionCard[] | undefined
	> = this.collection.getAllCardsResource;
	private readonly getCardResource: ResourceRef<Card | undefined> =
		this.tcgDex.getCardResource;
	private readonly cardId: WritableSignal<string | undefined> =
		this.tcgDex.cardId;

	protected cards: Signal<CollectionCard[]> = computed(() => {
		if (!this.getAllCardsResource.hasValue()) {
			return [];
		}

		return this.getAllCardsResource.value();
	});

	protected card: Signal<Card | undefined> = computed(() => {
		return this.getCardResource.value();
	});

	protected async getAllCards(): Promise<void> {
		this.getAllCardsResource.reload();
	}

	protected async getCard(id: string): Promise<void> {
		this.cardId.set(id);
	}
}
