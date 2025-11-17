import { type Db, type Collection, type UpdateResult, ObjectId } from 'mongodb';
import type { CollectionCardDeck } from '../model/collection-card.ts';

interface UpdateCollectionCardDeckParams {
	id: string;
	collectionCardDeck: CollectionCardDeck;
	db: Db;
}
export async function updateCollectionCardDeck({
	id,
	collectionCardDeck,
	db,
}: UpdateCollectionCardDeckParams): Promise<UpdateResult<CollectionCardDeck>> {
	const decks: Collection<CollectionCardDeck> = db.collection('decks');

	return await decks.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: collectionCardDeck },
	);
}
