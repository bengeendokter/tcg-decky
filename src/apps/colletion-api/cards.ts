import { Hono } from 'hono';
import { type CollectionCard } from '../../libs/collection/model/collection-card.ts';
import { getAllCollectionCards } from '../../libs/collection/data-access/get-all-collection-cards.ts';
import { db } from './hono.ts';

export const cards = new Hono().get('/', async (context) => {
	const cards: CollectionCard[] = await getAllCollectionCards(db);

	return context.json(cards);
});
