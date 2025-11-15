import { Collection, Db, MongoClient, type Document } from 'mongodb';
import type { CollectionCard } from '../model/collection-card.ts';

export async function connectToDatabase() {
	const url: string = 'mongodb://localhost:27017';
	const client: MongoClient = new MongoClient(url);

	// Database Name
	const dbName: string = 'tcg-decky';

	// Use connect method to connect to the server
	await client.connect();
	console.log('Connected successfully to server');
	const db: Db = client.db(dbName);
	const cards: Collection<CollectionCard> = db.collection<CollectionCard>('cards');

	await cards.insertOne({
		_id: 'swsh3-137',
		variants: {
			normal: 3,
			reverse: 1,
		}});

	await client.close();
}
