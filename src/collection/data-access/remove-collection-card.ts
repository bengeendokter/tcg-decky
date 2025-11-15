import type { Collection, Db, UpdateResult } from 'mongodb';
import type { CollectionCard } from '../model/collection-card.ts';

export interface RemoveCollectionCardParams {
	db: Db;
	collectionCard: CollectionCard;
}

export async function removeCollectionCard({
	db,
	collectionCard,
}: RemoveCollectionCardParams): Promise<UpdateResult<CollectionCard>> {
	const cards: Collection<CollectionCard> =
		db.collection<CollectionCard>('cards');

	const updateResult: UpdateResult<CollectionCard> = await cards.updateOne(
		{ _id: collectionCard._id },
		{
			$inc: {
				'variants.normal': (collectionCard.variants.normal ?? 0) * -1,
				'variants.reverse': (collectionCard.variants.reverse ?? 0) * -1,
				'variants.firstEdition':
					(collectionCard.variants.firstEdition ?? 0) * -1,
				'variants.holo': (collectionCard.variants.holo ?? 0) * -1,
				'variants.wPromo': (collectionCard.variants.wPromo ?? 0) * -1,
			},
		},
	);

	if (updateResult.modifiedCount === 0) {
		return updateResult;
	}

	return await cards.updateOne(
		{ _id: collectionCard._id },
		{
			$max: {
				'variants.normal': 0,
				'variants.reverse': 0,
				'variants.firstEdition': 0,
				'variants.holo': 0,
				'variants.wPromo': 0,
			},
		},
	);
}
