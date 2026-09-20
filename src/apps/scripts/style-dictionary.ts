import {
	THEME_NAME,
	THEME_NAME_THEME_TOKENS_MAP,
	THEME_NAMES,
	type ThemeName,
	type ThemeTokens,
} from '@style/model/theme';
import { getPaletteTokens, PURPLE_THEME_COLOR } from '@style/feature/export-palette-tokens';
import StyleDictionary, { type LogConfig, type TransformedToken } from 'style-dictionary';
import { type DesignTokens } from 'style-dictionary/types';
import {
	transformGroups,
	logWarningLevels,
	logVerbosityLevels,
	logBrokenReferenceLevels,
	formats,
	transforms,
} from 'style-dictionary/enums';

import type { Oklch } from '@style/model/palette';

import {
	getFontFamilyTokens,
	getFontWeightTokens,
	getPenpotTypescaleFontSizeTokens,
	getPenpotTypescaleLineHeightTokens,
	getTypescaleFontFamilyTokens,
	getTypescaleFontSizeTokens,
	getTypescaleFontWeightTokens,
	getTypescaleLineHeightTokens,
	getTypographyTokens,
} from '@style/model/typography';
import { exportObjectToJson } from '@style/data-access/export-full-palette-collection-tokens-to-json';
import { exportPenpotMetadata } from '@style/feature/export-penpot-metadata';
import { getPenpotShapeCornerTokens, getShapeCornerTokens } from '@style/model/shape-corner';

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

function getPaletteStyleDictionary(paletteName: string, themeColor: Oklch): StyleDictionary {
	return new StyleDictionary({
		tokens: {
			md: {
				ref: {
					[TOKEN_PATH_KEY.PALETTE]: getPaletteTokens(themeColor),
				},
			},
		},
		platforms: {
			[PLATFORM.CSS]: {
				transformGroup: transformGroups.css,
				transforms: [transforms.colorOklch],
				buildPath: 'output/style-dictionary/',
				files: [
					{
						destination: `palette-${paletteName}.css`,
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
				buildPath: 'output/style-dictionary/penpot/palette',
				files: [
					{
						destination: `palette-${paletteName}.json`,
						format: formats.json,
					},
				],
			},
		},
		log,
	});
}

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
				buildPath: 'output/style-dictionary/',
				files: [generateThemeFile(themeName)],
			},
		},
		log,
	});
}

const typographyTokens: DesignTokens = {
	md: {
		ref: {
			typeface: {
				font: getFontFamilyTokens(),
				weight: getFontWeightTokens(),
			},
		},
		sys: {
			typescale: {
				...getTypescaleFontFamilyTokens(),
				...getTypescaleFontSizeTokens(),
				...getTypescaleFontWeightTokens(),
				...getTypescaleLineHeightTokens(),
				...getTypographyTokens(),
			},
		},
	},
};

const penpotTypographyTokens: DesignTokens = {
	md: {
		ref: {
			typeface: {
				font: getFontFamilyTokens(),
				weight: getFontWeightTokens(),
			},
		},
		sys: {
			typescale: {
				...getTypescaleFontFamilyTokens(),
				...getPenpotTypescaleFontSizeTokens(),
				...getTypescaleFontWeightTokens(),
				...getPenpotTypescaleLineHeightTokens(),
				...getTypographyTokens(),
			},
		},
	},
};

function getTypographyStyleDictionary(): StyleDictionary {
	return new StyleDictionary({
		tokens: typographyTokens,
		platforms: {
			[PLATFORM.CSS]: {
				transformGroup: transformGroups.css,
				transforms: [transforms.sizePxToRem],
				buildPath: 'output/style-dictionary/',
				files: [
					{
						destination: `typography.css`,
						format: formats.cssVariables,
						options: {
							outputReferences: true,
							selector: 'html',
						},
					},
				],
			},
		},
		log,
	});
}

const shapeCornerTokens: DesignTokens = {
	md: {
		sys: {
			"shape-corner": getShapeCornerTokens(),
		},
	},
};

function getShapeCornerStyleDictionary(): StyleDictionary {
	return new StyleDictionary({
		tokens: shapeCornerTokens,
		platforms: {
			[PLATFORM.CSS]: {
				transformGroup: transformGroups.css,
				buildPath: 'output/style-dictionary/',
				files: [
					{
						destination: `shape-corner.css`,
						format: formats.cssVariables,
						options: {
							outputReferences: true,
							selector: 'html',
						},
					},
				],
			},
		},
		log,
	});
}

const penpotShapeCornerTokens: DesignTokens = {
	md: {
		sys: {
			"shape-corner": getPenpotShapeCornerTokens(),
		},
	},
};

const PALETTE_PARAMS = [
	['red', BLUE_THEME_COLOR],
	['purple', PURPLE_THEME_COLOR],
] as const satisfies [string, Oklch][];

await Promise.all(
	PALETTE_PARAMS.map(async ([name, color]) => {
		return await getPaletteStyleDictionary(name, color).buildAllPlatforms();
	}),
);

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
			destination: `output/style-dictionary/penpot/color-scheme/${themeName}.json`,
		});
		return await getThemeStyleDictionary(themeName).buildAllPlatforms();
	}),
);

exportPenpotMetadata();

await getTypographyStyleDictionary().buildAllPlatforms();

exportObjectToJson({
	object: penpotTypographyTokens,
	destination: `output/style-dictionary/penpot/typography.json`,
});

await getShapeCornerStyleDictionary().buildAllPlatforms();

exportObjectToJson({
	object: penpotShapeCornerTokens,
	destination: `output/style-dictionary/penpot/shape-corner.json`,
});
