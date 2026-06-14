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

// https://styledictionary.com/reference/utils/format-helpers/

const paletteFormat: FormatFn = async ({ dictionary, file, options, platform }) => {
	const { outputReferences, sort } = options;
	const header = await fileHeader({ file });

	return (
		header +
		`html {
${dictionary.allTokens
	.map((token) => {
		const [l, c, h] = token.original.$value.components;
		return `  --md-ref-${token.name}: oklch(${l} ${c} ${h});`;
	})
	.join('\n')}
}
`
	);
};

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
					format: 'paletteFormat',
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

StyleDictionary.registerFormat({
	name: 'paletteFormat',
	format: paletteFormat,
});

await styleDictionary.buildPlatform(transformGroups.css);
