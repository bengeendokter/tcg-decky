import TCGdex from "@tcgdex/sdk";

export function getTcgDex(tcgServerUrl: string): TCGdex {
	const tcgDex: TCGdex = new TCGdex('en');
	tcgDex.setEndpoint(tcgServerUrl);
	return tcgDex;
}
