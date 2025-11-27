import { Hono } from 'hono';

export const cards = new Hono().get('/', (c) => c.json('list authors'));
