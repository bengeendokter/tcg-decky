import { Injectable, resource, type ResourceRef } from '@angular/core';
import { getTcgDex } from '../../tcg-dex/data-access/get-tcg-dex';
import type TCGdex from '@tcgdex/sdk';
import { CONFIG } from '../../../environment/environment';
import type { Card } from '@tcgdex/sdk';

@Injectable({ providedIn: 'root' })
export class TcgDex {
	private readonly tcgDex: TCGdex = getTcgDex(CONFIG.TCG_DEX_SERVER_URL);

	private async getCard(id: string): Promise<Card | undefined> {
		const card: Card | null = await this.tcgDex.card.get(id);

		if (card === null) {
			return undefined;
		}

		return card;
	}

	public readonly getCardResource: ResourceRef<Card | undefined> = resource({
		loader: () => this.getCard('me01-096'),
	});
}
