import { getThemeTokens, lightTheme } from '@style/model/theme';
import { getPaletteTokens } from '@style/feature/export-palette-tokens';
import StyleDictionary from 'style-dictionary';
import {
	formats,
	transformGroups,
	logWarningLevels,
	logVerbosityLevels,
	logBrokenReferenceLevels,
} from 'style-dictionary/enums';

// Palette tokens
// const styleDictionary: StyleDictionary = new StyleDictionary({
// 	source: ['output/**/palette.tokens.json'],
// 	platforms: {
// 		css: {
// 			transformGroup: transformGroups.css,
// 			buildPath: 'output/styleDictionary/',
// 			files: [
// 				{
// 					destination: 'palette-variables.css',
// 					format: formats.cssVariables,
// 				},
// 			],
// 		},
// 	},
// 	log: {
// 		warnings: logWarningLevels.warn, // 'warn' | 'error' | 'disabled'
// 		verbosity: logVerbosityLevels.verbose, // 'default' | 'silent' | 'verbose'
// 		errors: {
// 			brokenReferences: logBrokenReferenceLevels.throw, // 'throw' | 'console'
// 		},
// 	},
// });

const styleDictionary: StyleDictionary = new StyleDictionary({
	tokens: {
		palette: getPaletteTokens(),
		... getThemeTokens(lightTheme),
	},
	platforms: {
		css: {
			transformGroup: transformGroups.css,
			buildPath: 'output/styleDictionary/',
			files: [
				{
					destination: 'palette-variables.css',
					format: formats.cssVariables,
					options: {
						outputReferences: true,
					},
				},
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

await styleDictionary.buildPlatform(transformGroups.css);
