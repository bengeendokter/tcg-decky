import {
	THEME_NAME,
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

const THEME_NAME_THEME_SELECTOR_MAP = {
	[THEME_NAME.LIGHT]: '.light',
	[THEME_NAME.LIGHT_MC]: '.light-medium-contrast',
	[THEME_NAME.LIGHT_HC]: '.light-high-contrast',
	[THEME_NAME.DARK]: '.dark',
	[THEME_NAME.DARK_MC]: '.dark-medium-contrast',
	[THEME_NAME.DARK_HC]: '.dark-high-contrast',
} as const satisfies Record<ThemeName, string>;

const TOKEN_PATH_KEY = {
	COLOR: 'color',
	PALETTE: 'palette',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

function generateThemeFile(theme: ThemeName) {
	return {
		destination: `${theme}.css`,
		format: formats.cssVariables,
		filter: (token: TransformedToken) => token.path[2] === TOKEN_PATH_KEY.COLOR,
		options: {
			outputReferences: true,
			selector: THEME_NAME_THEME_SELECTOR_MAP[theme],
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

const PLATFORM = {
	CSS: 'css',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

const paletteStyleDictionary: StyleDictionary = new StyleDictionary({
	tokens: {
		md: {
			ref: {
				[TOKEN_PATH_KEY.PALETTE]: getPaletteTokens(),
			},
		},
	},
	platforms: {
		[PLATFORM.CSS]: {
			transformGroup: transformGroups.css,
			transforms: [transforms.colorOklch],
			buildPath: 'output/styleDictionary/',
			files: [
				{
					destination: 'palette.css',
					format: formats.cssVariables,
					filter: (token) => token.path[2] === TOKEN_PATH_KEY.PALETTE,
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
					[TOKEN_PATH_KEY.PALETTE]: getPaletteTokens(),
				},
				sys: {
					[TOKEN_PATH_KEY.COLOR]: themeTokens,
				},
			},
		},
		platforms: {
			[PLATFORM.CSS]: {
				transformGroup: transformGroups.css,
				transforms: [transforms.colorOklch],
				buildPath: 'output/styleDictionary/',
				files: [generateThemeFile(themeName)],
			},
		},
		log,
	});
}

await paletteStyleDictionary.buildPlatform(PLATFORM.CSS);

await Promise.all(
	THEME_NAMES.map(async (themeName) => {
		return await getThemeStyleDictionary(themeName).buildPlatform(PLATFORM.CSS);
	}),
);
