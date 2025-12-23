const COLLECTION_API_URL =
	'http://192.168.0.131:4000/' as const satisfies string;

const TCG_DEX_SERVER_URL = 'http://192.168.0.131:3000/v2' as const satisfies string;

export const CONFIG = {
	COLLECTION_API_URL,
	TCG_DEX_SERVER_URL,
} as const satisfies Record<Uppercase<string>, string | object>;
