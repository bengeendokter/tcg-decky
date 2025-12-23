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

export const mongoDbDatabaseUrl: string =
	process.env.MONGO_DB_DATABASE_URL ?? CONFIG.MONGO_DB_DATABASE_URL;
console.log(`Connecting to database: ${mongoDbDatabaseUrl}`);
export const db: Db = await connectToDatabase(mongoDbDatabaseUrl);
console.log('Database connection complete');

const deckBuilderUrl: string | undefined = process.env.DECK_BUILDER_URL;

const origin: string[] = deckBuilderUrl !== undefined ? [deckBuilderUrl] : ['http://localhost:4200', 'http://192.168.0.131:4200'];

export const tcgDexServerUrl: string =
	process.env.TCG_DEX_SERVER_URL ?? CONFIG.TCG_DEX_SERVER_URL;

console.log(`Set CORS for ${deckBuilderUrl}`);

app.use(
	'*',
	cors({
		origin,
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
