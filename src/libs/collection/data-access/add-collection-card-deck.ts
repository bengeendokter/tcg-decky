import type { Collection, Db, InsertOneResult } from 'mongodb';
import type { CollectionCardDeck } from '../model/collection-card';

interface AddCollectionCardDeckParams {
	collectionCardDeck: CollectionCardDeck;
	db: Db;
}

export async function addCollectionCardDeck({
	collectionCardDeck,
	db,
}: AddCollectionCardDeckParams): Promise<InsertOneResult<CollectionCardDeck>> {
	const decks: Collection<CollectionCardDeck> = db.collection('decks');

	return await decks.insertOne(collectionCardDeck);
}
