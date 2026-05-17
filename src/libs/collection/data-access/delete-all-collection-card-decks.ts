import type { Collection, Db, DeleteResult } from 'mongodb';
import type { CollectionCardDeck } from '../model/collection-card.ts';

export async function deleteAllCollectionCardDecks(db: Db): Promise<DeleteResult> {
	const decks: Collection<CollectionCardDeck> = db.collection('decks');

	return await decks.deleteMany({});
}
