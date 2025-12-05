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
import type { WithId } from 'mongodb';

export interface UpdateCollectionCardDeckParams {
	id: string;
	deck: CollectionCardDeck;
}

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

	public async addCollectionCardDeck(
		deck: CollectionCardDeck,
	): Promise<string> {
		const validatedAndStrippedDeck: CollectionCardDeck | ArkErrors =
			collectionCardDeckValidatorAndStripper(deck);

		if (validatedAndStrippedDeck instanceof ArkErrors) {
			throw validatedAndStrippedDeck;
		}

		const response = await this.client.decks.$post({
			json: validatedAndStrippedDeck,
		});

		return (await response.json()).insertedId;
	}

	public async updateCollectionCardDeck({
		id,
		deck,
	}: UpdateCollectionCardDeckParams): Promise<void> {
		const validatedAndStrippedDeck: CollectionCardDeck | ArkErrors =
			collectionCardDeckValidatorAndStripper(deck);

		if (validatedAndStrippedDeck instanceof ArkErrors) {
			throw validatedAndStrippedDeck;
		}

		await this.client.decks[':id'].$put({
			param: { id },
			json: validatedAndStrippedDeck,
		});
	}

	public async deleteCollectionCardDeck(id: string): Promise<void> {
		await this.client.decks[':id'].$delete({ param: { id } });
	}

	private async getAllDecks(): Promise<WithId<CollectionCardDeck>[]> {
		const response = await this.client.decks.$get();
		const decks = await response.json();
		return decks;
	}

	public readonly getAllDecksResource: ResourceRef<
		WithId<CollectionCardDeck>[] | undefined
	> = resource({
		loader: () => this.getAllDecks(),
	});
}
