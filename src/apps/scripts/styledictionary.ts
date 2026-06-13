import StyleDictionary from 'style-dictionary';
import { formats, transformGroups } from 'style-dictionary/enums';

const styleDictionary: StyleDictionary = new StyleDictionary({
	source: ['output/**/*tokens.json'],
	platforms: {
		css: {
			transformGroup: transformGroups.css,
			buildPath: 'output/styleDictionary/',
			files: [
				{
					destination: 'variables.css',
					format: formats.cssVariables,
				},
			],
		},
	},
});

await styleDictionary.buildPlatform(transformGroups.css);
