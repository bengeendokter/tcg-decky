import type TCGdex from '@tcgdex/sdk';
import { CONFIG } from '../../config';
import { converLimitlessDeckToImportString } from '../../libs/limitless/feature/convert-limitless-deck-to-import-string';
import type { LimitlessDeck } from '../../libs/limitless/model/limitless-deck';
import { getTcgDex } from '../../libs/tcg-dex/data-access/get-tcg-dex';
import type { PrebuildDeck } from '../../libs/prebuild/model/prebuild-deck';
import { convertPrebuildToLimitlessDeck } from '../../libs/limitless/feature/convert-prebuild-to-limitless-deck';
import { importPrebuildDeckFromJson } from '../../libs/prebuild/data-access/import-prebuild-deck-from-json';
import { convertImportStringToLimitlessDecks } from '../../libs/limitless/feature/convert-import-string-to-limitless-deck';
import { limitlessDeckToString } from '../../libs/limitless/feature/limitless-deck-to-string';

const tcgDex: TCGdex = getTcgDex(CONFIG.TCG_DEX_SERVER_URL);

// const armarougeDeckJsonPath: string = `${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_ARMAROUGE}`;

// const prebuildDeck: PrebuildDeck = importPrebuildDeckFromJson(
// 	armarougeDeckJsonPath,
// );

// const limitlessDeck: LimitlessDeck = await convertPrebuildToLimitlessDeck({
// 	prebuildDeck,
// 	tcgDex,
// });

// const importString: string =
// 	await converLimitlessDeckToImportString(limitlessDeck);
// console.log(importString);

// my.limitlesstcg.com/builder?i=10133SVP1050233SVP1140i31SUMR
const importString: string = '10133SVP1050233SVP1140i31SUMR';

const limitlessDeck: LimitlessDeck = await convertImportStringToLimitlessDecks({
	tcgDex,
	importString,
});

console.log(limitlessDeckToString(limitlessDeck));
