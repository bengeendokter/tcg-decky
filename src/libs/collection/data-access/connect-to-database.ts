import { Db, MongoClient } from 'mongodb';

export async function connectToDatabase(url: string): Promise<Db> {
	const client: MongoClient = new MongoClient(url);
	const dbName: string = 'tcg-decky';

	await client.connect();
	const db: Db = client.db(dbName);
	return db;
}
