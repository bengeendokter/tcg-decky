import { CONFIG } from '@config';
import {
	darkHighContrastTheme,
	darkMediumContrastTheme,
	darkTheme,
	getThemeTokens,
	lightHighContrastTheme,
	lightMediumContrastTheme,
	lightTheme,
} from '../model/theme';
import { exportThemeTokensToJson } from '../data-access/export-theme-tokens-to-json';

const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;

function exportLightThemeTokens() {
	const themeTokens = getThemeTokens(lightTheme);
	const name: string = 'light';

	exportThemeTokensToJson({ themeTokens, outputDirectory, name });
}

function exportLightMediumContrastThemeTokens() {
	const themeTokens = getThemeTokens(lightMediumContrastTheme);
	const name: string = 'light-mc';

	exportThemeTokensToJson({ themeTokens, outputDirectory, name });
}

function exportLightHighContrastThemeTokens() {
	const themeTokens = getThemeTokens(lightHighContrastTheme);
	const name: string = 'light-hc';

	exportThemeTokensToJson({ themeTokens, outputDirectory, name });
}

function exportDarkThemeTokens() {
	const themeTokens = getThemeTokens(darkTheme);
	const name: string = 'dark';

	exportThemeTokensToJson({ themeTokens, outputDirectory, name });
}

function exportDarkMediumContrastThemeTokens() {
	const themeTokens = getThemeTokens(darkMediumContrastTheme);
	const name: string = 'dark-mc';

	exportThemeTokensToJson({ themeTokens, outputDirectory, name });
}

function exportDarkHighContrastThemeTokens() {
	const themeTokens = getThemeTokens(darkHighContrastTheme);
	const name: string = 'dark-hc';

	exportThemeTokensToJson({ themeTokens, outputDirectory, name });
}

export function exportThemeTokens() {
	exportLightThemeTokens();
	exportLightMediumContrastThemeTokens();
	exportLightHighContrastThemeTokens();
	exportDarkThemeTokens();
	exportDarkMediumContrastThemeTokens();
	exportDarkHighContrastThemeTokens();
}
