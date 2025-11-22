import { ObjectId, type Collection, type Db, type DeleteResult } from 'mongodb';
import type { CollectionCardDeck } from '../model/collection-card.ts';

export interface DeleteCollectionCardDeckParams {
	id: string;
	db: Db;
}

export async function deleteCollectionCardDeck({
	id,
	db,
}: DeleteCollectionCardDeckParams): Promise<DeleteResult> {
	const decks: Collection<CollectionCardDeck> = db.collection('decks');

	return await decks.deleteOne({ _id: new ObjectId(id) });
}
