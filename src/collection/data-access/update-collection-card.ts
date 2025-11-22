import { type Db, type Collection, type UpdateResult } from 'mongodb';
import type { CollectionCard } from '../model/collection-card.ts';

interface UpdateCollectionCardParams {
	collectionCard: CollectionCard;
	db: Db;
}
export async function updateCollectionCard({
	collectionCard,
	db,
}: UpdateCollectionCardParams): Promise<UpdateResult<CollectionCard>> {
	const decks: Collection<CollectionCard> = db.collection('cards');

	return await decks.updateOne(
		{ _id: collectionCard._id },
		{ $set: collectionCard },
	);
}
