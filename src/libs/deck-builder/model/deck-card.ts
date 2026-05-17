import type { TcgDexCollectionCard } from './tcg-dex-collection-card.ts';

export type DeckCard = TcgDexCollectionCard & {
	quantity: number;
};
