import type { Card } from "@tcgdex/sdk";
import type { CollectionCard } from "#collection/model/collection-card.ts";

export type TcgDexCollectionCard = Omit<Card, "variants"> & CollectionCard;
