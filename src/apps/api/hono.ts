import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cards } from './cards.ts';
import { logger } from 'hono/logger';
import { connectToDatabase } from '../../libs/collection/data-access/connect-to-database.ts';
import type { Db } from 'mongodb';
import { CONFIG } from '../../config.ts';
import { decks } from './decks.ts';

export const app = new Hono();

export const db: Db = await connectToDatabase(CONFIG.MONGO_DB_DATABASE_URL);

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
