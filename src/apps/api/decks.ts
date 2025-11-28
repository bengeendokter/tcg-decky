import { Hono } from 'hono';
import {
	collectionCardDeckValidator,
	type CollectionCardDeck,
} from '../../libs/collection/model/collection-card.ts';
import { getAllCollectionCardDecks } from '../../libs/collection/data-access/get-all-collection-card-decks.ts';
import { db } from './hono.ts';
import { getCollectionCardDeck } from '../../libs/collection/data-access/get-collection-card-deck.ts';
import { Type, type } from 'arktype';
import { arktypeValidator } from '@hono/arktype-validator';
import { addCollectionCardDeck } from '../../libs/collection/data-access/add-collection-card-deck.ts';
import type { DeleteResult, InsertOneResult, UpdateResult } from 'mongodb';
import { updateCollectionCardDeck } from '../../libs/collection/data-access/update-collection-card-deck.ts';
import { deleteCollectionCardDeck } from '../../libs/collection/data-access/delete-collection-card-deck.ts';

export interface DeckParams {
	id: string;
}

const deckParamsValidator: Type<DeckParams> = type({
	id: 'string == 24',
});

export const decks = new Hono()
	.get('/', async (context) => {
		const decks: CollectionCardDeck[] = await getAllCollectionCardDecks(db);

		return context.json(decks);
	})
	.get(
		'/:id',
		arktypeValidator('param', deckParamsValidator),
		async (context) => {
			const deckParams: DeckParams = context.req.valid('param');
			const id: string = deckParams.id;

			const deck: CollectionCardDeck | null = await getCollectionCardDeck({
				db,
				id,
			});

			if (deck === null) {
				context.status(404);
				return context.json({
					success: false,
					errors: [
						{
							code: 'idNotFound',
						},
					],
				});
			}

			return context.json(deck);
		},
	)
	.post(
		'/',
		arktypeValidator('json', collectionCardDeckValidator),
		async (context) => {
			const collectionCardDeck: CollectionCardDeck = context.req.valid('json');

			const collectionCardDeckInsertResult: InsertOneResult<CollectionCardDeck> =
				await addCollectionCardDeck({ collectionCardDeck, db });

			return context.json(collectionCardDeckInsertResult);
		},
	)
	.put(
		'/:id',
		arktypeValidator('param', deckParamsValidator),
		arktypeValidator('json', collectionCardDeckValidator),
		async (context) => {
			const deckParams: DeckParams = context.req.valid('param');
			const id: string = deckParams.id;

			const collectionCardDeck: CollectionCardDeck = context.req.valid('json');

			const collectionCardDeckUpdateResult: UpdateResult<CollectionCardDeck> =
				await updateCollectionCardDeck({ id, collectionCardDeck, db });

			return context.json(collectionCardDeckUpdateResult);
		},
	)
	.delete(
		'/:id',
		arktypeValidator('param', deckParamsValidator),
		async (context) => {
			const deckParams: DeckParams = context.req.valid('param');
			const id: string = deckParams.id;

			const collectionCardDeckDeleteResult: DeleteResult =
				await deleteCollectionCardDeck({ id, db });

			return context.json(collectionCardDeckDeleteResult);
		},
	);
