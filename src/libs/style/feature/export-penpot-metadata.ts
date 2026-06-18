import { exportPenpotMetadataToJson } from '../data-access/export-penpot-metadata-to-json';
import { SET_NAME, THEME_GROUP_NAME, type Metadata, type ThemeMetadata } from '../model/penpot-metadata';

export function exportPenpotMetadata() {
	const outputDirectory: string = `output/styleDictionary/penpot`;

	const metadata: Metadata = {
		tokenSetOrder: [
			SET_NAME.PALETTE,
			SET_NAME.LIGHT,
			SET_NAME.LIGHT_MC,
			SET_NAME.LIGHT_HC,
			SET_NAME.DARK,
			SET_NAME.DARK_MC,
			SET_NAME.DARK_HC,
		],
		activeThemes: ["Brand/Purple", 'Color Scheme/Light'],
	};

	const themeMetadata: ThemeMetadata[] = [
		{
			name: "Purple",
			group: THEME_GROUP_NAME.BRAND,
			selectedTokenSets: {
				[SET_NAME.PALETTE]: 'enabled',
			},
		},
		{
			name: "Light",
			group: THEME_GROUP_NAME.COLOR_SCHEME,
			selectedTokenSets: {
				[SET_NAME.LIGHT]: 'enabled',
			},
		},
		{
			name: "Dark",
			group: THEME_GROUP_NAME.COLOR_SCHEME,
			selectedTokenSets: {
				[SET_NAME.DARK]: 'enabled',
			},
		},
	];
	exportPenpotMetadataToJson({ outputDirectory, metadata, themeMetadata });
}
