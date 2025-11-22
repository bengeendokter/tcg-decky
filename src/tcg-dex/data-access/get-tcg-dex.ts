import TCGdex from "@tcgdex/sdk";

export function getTcgDex(tcgServerUrl: string): TCGdex {
	const tcgdex: TCGdex = new TCGdex('en');
	tcgdex.setEndpoint(tcgServerUrl);
	return tcgdex;
}
