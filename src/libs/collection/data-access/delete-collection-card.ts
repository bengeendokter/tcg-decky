import type { Collection, Db, DeleteResult } from 'mongodb';
import type { CollectionCard } from '../model/collection-card';

export interface DeleteCollectionCardParams {
	id: string;
	db: Db;
}

export async function deleteCollectionCard({
	id,
	db,
}: DeleteCollectionCardParams): Promise<DeleteResult> {
	const cards: Collection<CollectionCard> = db.collection('cards');

	return await cards.deleteOne({ _id: id });
}
