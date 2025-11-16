import type { MongoClient } from 'mongodb';

export async function closeDatabaseConnection(
	client: MongoClient,
): Promise<void> {
	return await client.close();
}
