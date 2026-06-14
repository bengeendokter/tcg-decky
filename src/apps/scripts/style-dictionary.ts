import { darkTheme, getThemeTokens, lightTheme } from '@style/model/theme';
import { getPaletteTokens } from '@style/feature/export-palette-tokens';
import StyleDictionary, { type TransformedToken } from 'style-dictionary';
import {
	transformGroups,
	logWarningLevels,
	logVerbosityLevels,
	logBrokenReferenceLevels,
	propertyFormatNames,
} from 'style-dictionary/enums';
import type { FormatFn } from 'style-dictionary/types';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';
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

const themeFormat: FormatFn = async ({ dictionary, file, options }) => {
	const header = await fileHeader({ file });
	const theme: string | undefined = Object.keys(dictionary.tokens)[0];

	if (typeof theme !== 'string') {
		throw Error('Invalid theme');
	}

	const mappedNamedictionary = {
		...dictionary,
		allTokens: dictionary.allTokens.map((transformedToken) => {
			const name = transformedToken.name.replace(theme, 'sys-color');
			return { ...transformedToken, name };
		}),
		unfilteredTokens: {
			...dictionary.unfilteredTokens,
			palette: Object.fromEntries(
				Object.entries(dictionary.unfilteredTokens?.['palette'] as Record<string, unknown>).map(
					([key, value]) => {
						return [
							key,
							Object.fromEntries(
								Object.entries(value as Record<string, TransformedToken>).map(
									([key, value]) => {
										return [key, { ...value, name: 'ref-' + value.name }];
									},
								),
							),
						];
					},
				),
			),
		},
	};

	const allVariables: string = formattedVariables({
		format: propertyFormatNames.css,
		dictionary: mappedNamedictionary,
		outputReferences: options.outputReferences,
		sort: options.sort,
		usesDtcg: true,
		formatting: {
			prefix: '--md-',
		},
	});

	return header + [`.${theme} {`, allVariables, '}'].join('\n');
};

function generateThemeFiles(themes: string[]) {
	return themes.map((theme) => ({
		destination: `${theme}.css`,
		format: 'themeFormat',
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
		warnings: logWarningLevels.warn,
		verbosity: logVerbosityLevels.verbose,
		errors: {
			brokenReferences: logBrokenReferenceLevels.throw,
		},
	},
});

StyleDictionary.registerFormat({
	name: 'paletteFormat',
	format: paletteFormat,
});

StyleDictionary.registerFormat({
	name: 'themeFormat',
	format: themeFormat,
});

await styleDictionary.buildPlatform(transformGroups.css);
