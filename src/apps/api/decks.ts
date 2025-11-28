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
import type { InsertOneResult } from 'mongodb';

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
	);

// 	- api/decks/:id
// 	- POST
// 	- UPDATE
// 	- DELETE
