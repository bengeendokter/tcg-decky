const COLLECTION_API_URL =
	'https://collection-api.home.bengeendokter.be/' as const satisfies string;

const TCG_DEX_SERVER_URL = 'https://tcgdex-api.home.bengeendokter.be/v2' as const satisfies string;

export const CONFIG = {
	COLLECTION_API_URL,
	TCG_DEX_SERVER_URL,
} as const satisfies Record<Uppercase<string>, string | object>;
