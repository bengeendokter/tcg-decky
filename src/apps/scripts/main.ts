import type TCGdex from '@tcgdex/sdk';
import { CONFIG } from '../../config';
import { converLimitlessCardsToImportString } from '../../libs/limitless/feature/convert-limitless-cards-to-import-string';
import type {
	LimitlessCard,
	LimitlessDeck,
} from '../../libs/limitless/model/limitless-deck';
import { getTcgDex } from '../../libs/tcg-dex/data-access/get-tcg-dex';
import type { PrebuildDeck } from '../../libs/prebuild/model/prebuild-deck';
import { convertPrebuildToLimitlessDeck } from '../../libs/limitless/feature/convert-prebuild-to-limitless-deck';
import { importPrebuildDeckFromJson } from '../../libs/prebuild/data-access/import-prebuild-deck-from-json';

const tcgDex: TCGdex = getTcgDex(CONFIG.TCG_DEX_SERVER_URL);

const armarougeDeckJsonPath: string = `${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_ARMAROUGE}`;

const prebuildDeck: PrebuildDeck = importPrebuildDeckFromJson(
	armarougeDeckJsonPath,
);

const limitlessDeck: LimitlessDeck = await convertPrebuildToLimitlessDeck({
	prebuildDeck,
	tcgDex,
});

const LimitlessCards: LimitlessCard[] = limitlessDeck.pokemon.concat(
	limitlessDeck.trainer,
	limitlessDeck.energy,
);

const importString: string =
	await converLimitlessCardsToImportString(LimitlessCards);
console.log(importString);
