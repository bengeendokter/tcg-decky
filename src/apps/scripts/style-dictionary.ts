import { getThemeTokens, lightTheme } from '@style/model/theme';
import { getPaletteTokens } from '@style/feature/export-palette-tokens';
import StyleDictionary, { type TransformedToken } from 'style-dictionary';
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

const styleDictionary: StyleDictionary = new StyleDictionary({
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
			options: {
				selector: 'html',
			},
			files: [
				{
					destination: 'palette.css',
					format: formats.cssVariables,
					filter: (token) => token.path[2] === 'palette',
				},
				generateThemeFile('light'),
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

await styleDictionary.buildPlatform(transformGroups.css);
