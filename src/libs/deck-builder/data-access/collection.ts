import { Injectable } from '@angular/core';
import { hc } from 'hono/client';
import type { AppType } from '../../../apps/collection-api/hono.ts';
import type { CollectionCard } from '../../collection/model/collection-card.ts';

@Injectable({ providedIn: 'root' })
export class Collection {
	private readonly client = hc<AppType>('http://localhost:4000/');

	public async getAllCards(): Promise<CollectionCard[]> {
		const response = await this.client.cards.$get();
		const cards = await response.json();
		return cards as CollectionCard[];
	}
}
