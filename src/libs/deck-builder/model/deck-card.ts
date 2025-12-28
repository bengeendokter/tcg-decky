import type { TcgDexCollectionCard } from "./tcg-dex-collection-card";

export type DeckCard = TcgDexCollectionCard & {
	quantity: number;
};
