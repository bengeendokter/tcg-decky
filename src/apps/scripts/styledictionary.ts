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

function generateComponentFiles(components: string[]) {
	return components.map((comp) => ({
		// output the component tokens in the right folder and file e.g. components/button/button-vars.css
		destination: `${comp}-variables.css`,
		format: formats.cssVariables,
		// only include the tokens that are inside this component token group
		filter: (token: TransformedToken) => token.path[0] === comp,
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
					destination: 'palette-variables.css',
					format: formats.cssVariables,
					filter: (token) => token.path[0] === 'palette',
				},
				...generateComponentFiles(['light', 'dark']),
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
