import type { Card } from '@tcgdex/sdk';
import type { CollectionCard } from '../../collection/model/collection-card';

export type TcgDexCollectionCard = Omit<Card, 'variants'> & CollectionCard;
