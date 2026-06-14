import { getThemeTokens, lightTheme, THEME_NAME_THEME_TOKENS_MAP } from '@style/model/theme';
import { getPaletteTokens } from '@style/feature/export-palette-tokens';
import StyleDictionary, { type LogConfig, type TransformedToken } from 'style-dictionary';
import {
	transformGroups,
	logWarningLevels,
	logVerbosityLevels,
	logBrokenReferenceLevels,
	formats,
	transforms,
} from 'style-dictionary/enums';

function generateThemeFile(theme: string) {
	return {
		destination: `${theme}.css`,
		format: formats.cssVariables,
		filter: (token: TransformedToken) => token.path[2] === 'color',
		options: {
			outputReferences: true,
			selector: `.${theme}`,
		},
	};
}

const eee = THEME_NAME_THEME_TOKENS_MAP;

const log: LogConfig = {
	warnings: logWarningLevels.warn,
	verbosity: logVerbosityLevels.verbose,
	errors: {
		brokenReferences: logBrokenReferenceLevels.throw,
	},
};

const paletteStyleDictionary: StyleDictionary = new StyleDictionary({
	tokens: {
		md: {
			ref: {
				palette: getPaletteTokens(),
			},
		},
	},
	platforms: {
		css: {
			transformGroup: transformGroups.css,
			transforms: [transforms.colorOklch],
			buildPath: 'output/styleDictionary/',
			files: [
				{
					destination: 'palette.css',
					format: formats.cssVariables,
					filter: (token) => token.path[2] === 'palette',
					options: {
						selector: 'html',
					},
				},
			],
		},
	},
	log,
});

const themeStyleDictionary: StyleDictionary = new StyleDictionary({
	tokens: {
		md: {
			ref: {
				palette: getPaletteTokens(),
			},
			sys: {
				color: getThemeTokens(lightTheme),
			},
		},
	},
	platforms: {
		css: {
			transformGroup: transformGroups.css,
			transforms: [transforms.colorOklch],
			buildPath: 'output/styleDictionary/',
			files: [generateThemeFile('light')],
		},
	},
	log,
});

await paletteStyleDictionary.buildPlatform('css');
await themeStyleDictionary.buildPlatform('css');
