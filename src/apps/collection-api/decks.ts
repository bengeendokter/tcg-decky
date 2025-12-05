import { Hono } from 'hono';
import {
	collectionCardDeckValidator,
	type CollectionCard,
	type CollectionCardDeck,
} from '../../libs/collection/model/collection-card';
import { getAllCollectionCardDecks } from '../../libs/collection/data-access/get-all-collection-card-decks';
import { db } from './hono';
import { getCollectionCardDeck } from '../../libs/collection/data-access/get-collection-card-deck';
import { Type, type } from 'arktype';
import { arktypeValidator } from '@hono/arktype-validator';
import { addCollectionCardDeck } from '../../libs/collection/data-access/add-collection-card-deck';
import type { DeleteResult, InsertOneResult, UpdateResult, WithId } from 'mongodb';
import { updateCollectionCardDeck } from '../../libs/collection/data-access/update-collection-card-deck';
import { deleteCollectionCardDeck } from '../../libs/collection/data-access/delete-collection-card-deck';
import type { BlankEnv } from 'hono/types';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export interface DeckParams {
	id: string;
}

const deckParamsValidator: Type<DeckParams> = type({
	id: 'string == 24',
});

type CorrectedGetAllDecks = Hono<
	BlankEnv,
	{
		'/': {
			$get: {
				input: {};
				output: WithId<CollectionCardDeck>[];
				outputFormat: 'json';
				status: ContentfulStatusCode;
			};
		};
	},
	'/'
>;

const getAllDecks: CorrectedGetAllDecks = new Hono().get(
	'/',
	async (context) => {
		const decks: CollectionCardDeck[] = await getAllCollectionCardDecks(db);

		return context.json(decks);
	},
);

export const decks = getAllDecks
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
