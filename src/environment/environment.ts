const COLLECTION_API_URL = 'http://localhost:4000/' as const satisfies string;;

export const CONFIG = {
	COLLECTION_API_URL,
} as const satisfies Record<Uppercase<string>, string | object>;
