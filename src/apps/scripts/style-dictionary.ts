import {
	THEME_NAME_THEME_TOKENS_MAP,
	THEME_NAMES,
	type ThemeName,
	type ThemeTokens,
} from '@style/model/theme';
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

function getThemeStyleDictionary(themeName: ThemeName): StyleDictionary {
	const themeTokens: ThemeTokens = THEME_NAME_THEME_TOKENS_MAP[themeName];

	return new StyleDictionary({
		tokens: {
			md: {
				ref: {
					palette: getPaletteTokens(),
				},
				sys: {
					color: themeTokens,
				},
			},
		},
		platforms: {
			css: {
				transformGroup: transformGroups.css,
				transforms: [transforms.colorOklch],
				buildPath: 'output/styleDictionary/',
				files: [generateThemeFile(themeName)],
			},
		},
		log,
	});
}

await paletteStyleDictionary.buildPlatform('css');

await Promise.all(
	THEME_NAMES.map(async (themeName) => {
		return await getThemeStyleDictionary(themeName).buildPlatform('css');
	}),
);
