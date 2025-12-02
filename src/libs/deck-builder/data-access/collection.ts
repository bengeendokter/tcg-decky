import { Injectable, resource, type ResourceRef } from '@angular/core';
import { hc } from 'hono/client';
import type { AppType } from '../../../apps/collection-api/hono';
import type { CollectionCard } from '../../collection/model/collection-card';
import { CONFIG } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class Collection {
	private readonly client = hc<AppType>(CONFIG.COLLECTION_API_URL);

	private async getAllCards(): Promise<CollectionCard[]> {
		const response = await this.client.cards.$get();
		const cards = await response.json();
		return cards;
	}

	public readonly getAllCardsRecource: ResourceRef<
		CollectionCard[] | undefined
	> = resource({
		loader: () => this.getAllCards(),
	});
}
