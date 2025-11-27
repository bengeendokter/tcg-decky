import { ObjectId, type Collection, type Db, type WithId } from 'mongodb';
import type { CollectionCardDeck } from '../model/collection-card.ts';

interface GetCollectionCardDeckParams {
	id: string;
	db: Db;
}

export async function getCollectionCardDeck({
	id,
	db,
}: GetCollectionCardDeckParams): Promise<WithId<CollectionCardDeck> | null> {
	const decks: Collection<CollectionCardDeck> = db.collection('decks');

	return await decks.findOne({ _id: new ObjectId(id) });
}
