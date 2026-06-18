import { exportPenpotMetadataToJson } from '../data-access/export-penpot-metadata-to-json';
import {
	SET_NAME,
	THEME_GROUP_NAME,
	type Metadata,
	type ThemeMetadata,
} from '../model/penpot-metadata';

export function exportPenpotMetadata() {
	const outputDirectory: string = `output/style-dictionary/penpot`;

	const metadata: Metadata = {
		tokenSetOrder: [
			`palette/${SET_NAME.PALETTE_RED}`,
			`palette/${SET_NAME.PALETTE_PURPLE}`,
			`color-scheme/${SET_NAME.LIGHT}`,
			`color-scheme/${SET_NAME.LIGHT_MC}`,
			`color-scheme/${SET_NAME.LIGHT_HC}`,
			`color-scheme/${SET_NAME.DARK}`,
			`color-scheme/${SET_NAME.DARK_MC}`,
			`color-scheme/${SET_NAME.DARK_HC}`,
		],
		activeThemes: ['Brand/Purple', 'Color Scheme/Light'],
	};

	const themeMetadata: ThemeMetadata[] = [
		{
			name: 'Purple',
			group: THEME_GROUP_NAME.BRAND,
			selectedTokenSets: {
				[`palette/${SET_NAME.PALETTE_PURPLE}`]: 'enabled',
			},
		},
		{
			name: 'Red',
			group: THEME_GROUP_NAME.BRAND,
			selectedTokenSets: {
				[`palette/${SET_NAME.PALETTE_RED}`]: 'enabled',
			},
		},
		{
			name: 'Light',
			group: THEME_GROUP_NAME.COLOR_SCHEME,
			selectedTokenSets: {
				[`color-scheme/${SET_NAME.LIGHT}`]: 'enabled',
			},
		},
		{
			name: 'Light Medium Contrast',
			group: THEME_GROUP_NAME.COLOR_SCHEME,
			selectedTokenSets: {
				[`color-scheme/${SET_NAME.LIGHT_MC}`]: 'enabled',
			},
		},
		{
			name: 'Light High Contrast',
			group: THEME_GROUP_NAME.COLOR_SCHEME,
			selectedTokenSets: {
				[`color-scheme/${SET_NAME.LIGHT_HC}`]: 'enabled',
			},
		},
		{
			name: 'Dark',
			group: THEME_GROUP_NAME.COLOR_SCHEME,
			selectedTokenSets: {
				[`color-scheme/${SET_NAME.DARK}`]: 'enabled',
			},
		},
		{
			name: 'Dark Medium Contrast',
			group: THEME_GROUP_NAME.COLOR_SCHEME,
			selectedTokenSets: {
				[`color-scheme/${SET_NAME.DARK_MC}`]: 'enabled',
			},
		},
		{
			name: 'Dark High Contrast',
			group: THEME_GROUP_NAME.COLOR_SCHEME,
			selectedTokenSets: {
				[`color-scheme/${SET_NAME.DARK_HC}`]: 'enabled',
			},
		},
	];
	exportPenpotMetadataToJson({ outputDirectory, metadata, themeMetadata });
}
