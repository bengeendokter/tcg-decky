import { darkTheme, getThemeTokens, lightTheme } from '@style/model/theme';
import { getPaletteTokens } from '@style/feature/export-palette-tokens';
import StyleDictionary, { type TransformedToken } from 'style-dictionary';
import {
	formats,
	transformGroups,
	logWarningLevels,
	logVerbosityLevels,
	logBrokenReferenceLevels,
} from 'style-dictionary/enums';
import type { FormatFn } from 'style-dictionary/types';
import { fileHeader } from 'style-dictionary/utils';
import type { Oklch } from '@style/model/palette';

interface GetPaletteCssVariableParams {
	tokenName: string;
	oklch: Oklch;
}

function getPaletteCssVariableParams(token: TransformedToken): GetPaletteCssVariableParams {
	const tokenName: string = token.name;
	const [l, c, h] = token.original.$value.components;
	const oklch: Oklch = { l, c, h };
	return { tokenName, oklch };
}

function getPaletteCssVariable({ tokenName, oklch }: GetPaletteCssVariableParams) {
	const { l, c, h } = oklch;
	return `  --md-ref-${tokenName}: oklch(${l} ${c} ${h});`;
}

const paletteFormat: FormatFn = async ({ dictionary, file }) => {
	const header = await fileHeader({ file });
	const allVariables: string[] = dictionary.allTokens
		.map(getPaletteCssVariableParams)
		.map(getPaletteCssVariable);

	return header + ['html {', ...allVariables, '}'].join('\n');
};

function generateThemeFiles(themes: string[]) {
	return themes.map((theme) => ({
		destination: `${theme}.css`,
		format: formats.cssVariables,
		filter: (token: TransformedToken) => token.path[0] === theme,
		options: {
			outputReferences: true,
		},
	}));
}

const styleDictionary: StyleDictionary = new StyleDictionary({
	tokens: {
		palette: getPaletteTokens(),
		light: getThemeTokens(lightTheme),
		dark: getThemeTokens(darkTheme),
	},
	platforms: {
		css: {
			transformGroup: transformGroups.css,
			buildPath: 'output/styleDictionary/',
			files: [
				{
					destination: 'palette.css',
					format: 'paletteFormat',
					filter: (token) => token.path[0] === 'palette',
				},
				...generateThemeFiles(['light', 'dark']),
			],
		},
	},
	log: {
		warnings: logWarningLevels.warn, // 'warn' | 'error' | 'disabled'
		verbosity: logVerbosityLevels.verbose, // 'default' | 'silent' | 'verbose'
		errors: {
			brokenReferences: logBrokenReferenceLevels.throw, // 'throw' | 'console'
		},
	},
});

StyleDictionary.registerFormat({
	name: 'paletteFormat',
	format: paletteFormat,
});

await styleDictionary.buildPlatform(transformGroups.css);
