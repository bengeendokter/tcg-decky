import { Hono } from 'hono';
import { type CollectionCard } from '../../libs/collection/model/collection-card';
import { getAllCollectionCards } from '../../libs/collection/data-access/get-all-collection-cards';
import { db, mongoDbDatabaseUrl, tcgDexServerUrl } from './hono';
import type { BlankEnv } from 'hono/types';
import type { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status';
import { resetCollectionCardsDatabase } from '../../libs/collection/feature/reset-collection-cards-database';

const inferredCards = new Hono()
	.get('/', async (context) => {
		const cards: CollectionCard[] = await getAllCollectionCards(db);

		return context.json(cards);
	})
	.put('/reset', async (context) => {
		await resetCollectionCardsDatabase({ mongoDbDatabaseUrl, tcgDexServerUrl });
		return context.text('Card collection has been reset.');
	});

type InferredCardsRoute = typeof inferredCards;

type CorrectedCardsRoute = Hono<
	BlankEnv,
	{
		'/': {
			$get: {
				input: {};
				output: CollectionCard[];
				outputFormat: 'json';
				status: ContentfulStatusCode;
			};
		};
	} & {
		'/reset': {
			$put: {
				input: {};
				output: 'Card collection has been reset.';
				outputFormat: 'text';
				status: ContentfulStatusCode;
			};
		};
	},
	'/'
>;

export const cards: CorrectedCardsRoute = inferredCards;
