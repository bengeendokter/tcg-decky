import { Hono } from 'hono';
import { type CollectionCard } from '../../libs/collection/model/collection-card.ts';
import { getAllCollectionCards } from '../../libs/collection/data-access/get-all-collection-cards.ts';
import { db } from './hono.ts';
import type { BlankEnv } from 'hono/types';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export const cards: CardsRoute = new Hono().get('/', async (context) => {
	const cards: CollectionCard[] = await getAllCollectionCards(db);

	return context.json(cards);
});


export type CardsRoute = Hono<BlankEnv, {
    "/": {
        $get: {
            input: {};
            output: CollectionCard[];
            outputFormat: "json";
            status: ContentfulStatusCode;
        };
    };
}, "/">
