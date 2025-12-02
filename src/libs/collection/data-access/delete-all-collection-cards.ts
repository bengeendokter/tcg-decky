import type { Collection, Db, DeleteResult } from 'mongodb';
import type { CollectionCard } from '../model/collection-card';

export async function deleteAllCollectionCard(db: Db): Promise<DeleteResult> {
	const cards: Collection<CollectionCard> = db.collection('cards');

	return await cards.deleteMany({});
}
