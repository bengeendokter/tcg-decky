const COLLECTION_API_URL =
	'https://collection-api.home.bengeendokter.be/' as const satisfies string;

export const CONFIG = {
	COLLECTION_API_URL,
} as const satisfies Record<Uppercase<string>, string | object>;
