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
	const cards: Collection<CollectionCard> = db.collection('cards');

	return await cards.updateOne(
		{ _id: collectionCard._id },
		{ $set: collectionCard },
	);
}
