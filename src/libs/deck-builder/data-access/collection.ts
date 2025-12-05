import { Injectable, resource, type ResourceRef } from '@angular/core';
import { hc } from 'hono/client';
import type { AppType } from '../../../apps/collection-api/hono';
import {
	collectionCardDeckValidatorAndStripper,
	type CollectionCard,
	type CollectionCardDeck,
} from '../../collection/model/collection-card';
import { CONFIG } from '../../../environment/environment';
import { ArkErrors } from 'arktype';

@Injectable({ providedIn: 'root' })
export class Collection {
	private readonly client = hc<AppType>(CONFIG.COLLECTION_API_URL);

	private async getAllCards(): Promise<CollectionCard[]> {
		const response = await this.client.cards.$get();
		const cards = await response.json();
		return cards;
	}

	public readonly getAllCardsResource: ResourceRef<
		CollectionCard[] | undefined
	> = resource({
		loader: () => this.getAllCards(),
	});

	public async addCollectionCardDeck(deck: CollectionCardDeck): Promise<void> {
		const validatedAndStrippedDeck: CollectionCardDeck | ArkErrors =
			collectionCardDeckValidatorAndStripper(deck);

		if (validatedAndStrippedDeck instanceof ArkErrors) {
			throw validatedAndStrippedDeck;
		}

		await this.client.decks.$post({ json: validatedAndStrippedDeck });
	}
}
