import { Collection, Db, MongoClient } from 'mongodb';
import type { CollectionCard } from '../model/collection-card.ts';

export async function connectToDatabase(url: string): Promise<Db> {
	const client: MongoClient = new MongoClient(url);
	const dbName: string = 'tcg-decky';

	await client.connect();
	const db: Db = client.db(dbName);
	return db;
}
