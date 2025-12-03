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
	.put('/reset', async () => {
		await resetCollectionCardsDatabase({ mongoDbDatabaseUrl, tcgDexServerUrl });
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
				output: {};
				outputFormat: string;
				status: StatusCode;
			};
		};
	},
	'/'
>;

export const cards: CorrectedCardsRoute = inferredCards;
