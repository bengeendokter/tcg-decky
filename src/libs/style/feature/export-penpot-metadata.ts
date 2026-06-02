import { CONFIG } from '@config';
import { exportPenpotMetadataToJson } from '../data-access/export-penpot-metadata-to-json';
import { SET_NAME, THEME_NAME, type Metadata, type ThemeMetadata } from '../model/penpot-metadata';

export function exportPenpotMetadata() {
	const outputDirectory: string = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/penpot`;

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
		activeThemes: [THEME_NAME.LIGHT],
		activeSets: [SET_NAME.PALETTE, SET_NAME.LIGHT],
	};

	const themeMetadata: ThemeMetadata[] = [
		{
			name: THEME_NAME.LIGHT,
			selectedTokenSets: {
				[SET_NAME.PALETTE]: 'enabled',
				[SET_NAME.LIGHT]: 'enabled',
			},
		},
		{
			name: THEME_NAME.DARK,
			selectedTokenSets: {
				[SET_NAME.PALETTE]: 'enabled',
				[SET_NAME.DARK]: 'enabled',
			},
		},
	];
	exportPenpotMetadataToJson({ outputDirectory, metadata, themeMetadata });
}
