import type TCGdex from "@tcgdex/sdk";
// import { converLimitlessDeckToImportString } from '#limitless/feature/convert-limitless-deck-to-import-string';
// import type { PrebuildDeck } from '#prebuild/model/prebuild-deck';
// import { convertPrebuildToLimitlessDeck } from '#limitless/feature/convert-prebuild-to-limitless-deck';
// import { importPrebuildDeckFromJson } from '#prebuild/data-access/import-prebuild-deck-from-json';
import { CONFIG } from "#config/config.ts";
import type { LimitlessDeck } from "#limitless/model/limitless-deck.ts";
import { getTcgDex } from "#tcg-dex/data-access/get-tcg-dex.ts";
import { convertImportStringToLimitlessDecks } from "#limitless/feature/convert-import-string-to-limitless-deck.ts";
import { limitlessDeckToString } from "#limitless/util/limitless-deck-to-string.ts";

const tcgDex = getTcgDex(CONFIG.TCG_DEX_SERVER_URL);

// const armarougeDeckJsonPath: string = `${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_ARMAROUGE}`;

// const prebuildDeck: PrebuildDeck = importPrebuildDeckFromJson(
// 	armarougeDeckJsonPath,
// );

// const limitlessDeck: LimitlessDeck = await convertPrebuildToLimitlessDeck({
// 	prebuildDeck,
// 	tcgDex,
// });

// const importString: string =
// 	converLimitlessDeckToImportString(limitlessDeck);
// console.log(importString);

// my.limitlesstcg.com/builder?i=10133SVP1050233SVP1140i31SUMR
const importString: string = "10133SVP1050233SVP1140i31SUMR";

const limitlessDeck: LimitlessDeck = await convertImportStringToLimitlessDecks({
  tcgDex,
  importString,
});

console.log(limitlessDeckToString(limitlessDeck));
