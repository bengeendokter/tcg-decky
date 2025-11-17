import type { Collection, Db, WithId } from 'mongodb';
import type { CollectionCardDeck } from '../model/collection-card.ts';

export async function getAllCollectionCardDecks(
	db: Db,
): Promise<WithId<CollectionCardDeck>[]> {
	const decks: Collection<CollectionCardDeck> = db.collection('decks');

	return await decks.find().toArray();
}
