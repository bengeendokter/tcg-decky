import type { Collection, Db } from 'mongodb';
import type { CollectionCard } from '../model/collection-card';

export async function getAllCollectionCards(db: Db): Promise<CollectionCard[]> {
	const cards: Collection<CollectionCard> = db.collection('cards');
	return await cards.find({}).toArray();
}
