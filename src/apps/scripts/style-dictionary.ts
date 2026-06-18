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
import { exportPenpotMetadata } from '@style/feature/export-penpot-metadata';
import type { Oklch } from '@style/model/palette';
import { exportObjectToJson } from '@style/data-access/export-full-palette-collection-tokens-to-json';

const BLUE_THEME_COLOR = { l: 0.63, c: 0.26, h: 29.23 } as const satisfies Oklch;

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
	PENPOT: 'penpot',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

const paletteStyleDictionary: StyleDictionary = new StyleDictionary({
	tokens: {
		md: {
			ref: {
				[TOKEN_PATH_KEY.PALETTE]: getPaletteTokens(BLUE_THEME_COLOR),
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
		[PLATFORM.PENPOT]: {
			transforms: [transforms.colorHsl],
			buildPath: 'output/styleDictionary/penpot',
			files: [
				{
					destination: 'palette.json',
					format: formats.json,
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

await paletteStyleDictionary.buildAllPlatforms();

await Promise.all(
	THEME_NAMES.map(async (themeName) => {
		exportObjectToJson({
			object: {
				md: {
					sys: {
						[TOKEN_PATH_KEY.COLOR]: THEME_NAME_THEME_TOKENS_MAP[themeName],
					},
				},
			},
			destination: `output/styleDictionary/penpot/${themeName}.json`,
		});
		return await getThemeStyleDictionary(themeName).buildAllPlatforms();
	}),
);

exportPenpotMetadata();
