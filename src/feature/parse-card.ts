import { parseEnergyType } from "./parse-energy-type.ts";
import type { EnergyType } from "../model/energy.ts";
import type { Card } from "../model/prebuild-deck.ts";
import { type Title, isEnergyTitle } from "../model/title.ts";
import { parseSetCard } from "./parse-set-card.ts";


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
