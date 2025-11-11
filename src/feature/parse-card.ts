import { parseEnergyType } from "./parse-energy-type.js";
import type { EnergyType } from "../model/energy.js";
import type { Card } from "../model/prebuild-deck.js";
import { type Title, isEnergyTitle } from "../model/title.js";
import { parseSetCard } from "./parse-set-card.js";


export function parseCard(title: Title): Card {
    if (isEnergyTitle(title)) {
        const energyType: EnergyType | undefined = parseEnergyType(title);

        if (!energyType) {
            throw Error(`Unable to parse energy type from title: ${title}`);
        }

        return `Basic ${energyType} Energy`;
    }

    return parseSetCard(title);
}
