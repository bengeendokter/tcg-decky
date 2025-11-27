import { type Set } from '@tcgdex/sdk';

export interface SetWithAbbreviation extends Set {
	abbreviation?: {
		official?: string;
	};
}
