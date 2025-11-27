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
	const cards: Collection<CollectionCard> = db.collection('cards');

	const {
		normal,
		reverse,
		firstEdition,
		holo,
		wPromo,
	}: CollectionCard['variants'] = collectionCard.variants;

	const normalRemoveAmount: number = normal ?? 0;
	const reverseRemoveAmount: number = reverse ?? 0;
	const firstEditionRemoveAmount: number = firstEdition ?? 0;
	const holoRemoveAmount: number = holo ?? 0;
	const wPromoRemoveAmount: number = wPromo ?? 0;

	const updateResult: UpdateResult<CollectionCard> = await cards.updateOne(
		{ _id: collectionCard._id },
		[
			{
				$set: {
					'variants.normal': {
						$cond: {
							if: {
								$lt: [normalRemoveAmount, '$variants.normal'],
							},
							then: {
								$add: ['$variants.normal', normalRemoveAmount * -1],
							},
							else: '$$REMOVE',
						},
					},
					'variants.reverse': {
						$cond: {
							if: {
								$lt: [reverseRemoveAmount, '$variants.reverse'],
							},
							then: {
								$add: ['$variants.reverse', reverseRemoveAmount * -1],
							},
							else: '$$REMOVE',
						},
					},
					'variants.firstEdition': {
						$cond: {
							if: {
								$lt: [firstEditionRemoveAmount, '$variants.firstEdition'],
							},
							then: {
								$add: ['$variants.firstEdition', firstEditionRemoveAmount * -1],
							},
							else: '$$REMOVE',
						},
					},
					'variants.holo': {
						$cond: {
							if: {
								$lt: [holoRemoveAmount, '$variants.holo'],
							},
							then: {
								$add: ['$variants.holo', holoRemoveAmount * -1],
							},
							else: '$$REMOVE',
						},
					},
					'variants.wPromo': {
						$cond: {
							if: {
								$lt: [wPromoRemoveAmount, '$variants.wPromo'],
							},
							then: {
								$add: ['$variants.wPromo', wPromoRemoveAmount * -1],
							},
							else: '$$REMOVE',
						},
					},
				},
			},
		],
	);

	return updateResult;
}
