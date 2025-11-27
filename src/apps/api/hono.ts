import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cards } from './cards.ts';
import { logger } from 'hono/logger';

export const app = new Hono();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

app.use(logger());

const routes = app.route('/cards', cards);

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

export type AppType = typeof routes;
