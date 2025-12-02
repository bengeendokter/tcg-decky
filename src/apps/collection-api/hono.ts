import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cards } from './cards';
import { logger } from 'hono/logger';
import { connectToDatabase } from '../../libs/collection/data-access/connect-to-database';
import type { Db } from 'mongodb';
import { CONFIG } from '../../config';
import { decks } from './decks';
import { cors } from 'hono/cors';

export const app = new Hono();

console.log('Connecting to database');
const databaseUrl: string =
	process.env.MONGO_DB_DATABASE_URL ?? CONFIG.MONGO_DB_DATABASE_URL;
export const db: Db = await connectToDatabase(databaseUrl);
console.log('Database connection complete');

const deckBuilderUrl: string =
	process.env.DECK_BUILDER_URL ?? 'http://localhost:4200';

app.use(
	'*',
	cors({
		origin: [deckBuilderUrl],
	}),
);

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

app.use(logger());

const routes = app.route('/cards', cards).route('/decks', decks);

serve(
	{
		fetch: app.fetch,
		port: 4000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

export type AppType = typeof routes;
