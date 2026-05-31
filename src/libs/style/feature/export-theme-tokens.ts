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
import { exportPenpotThemeTokensToJson, exportThemeTokensToJson } from '../data-access/export-theme-tokens-to-json';

function exportLightThemeTokens(
	outputDirectory: string,
	exportFunction: typeof exportThemeTokensToJson,
) {
	const themeTokens = getThemeTokens(lightTheme);
	const name: string = 'light';

	exportFunction({ themeTokens, outputDirectory, name });
}

function exportLightMediumContrastThemeTokens(
	outputDirectory: string,
	exportFunction: typeof exportThemeTokensToJson,
) {
	const themeTokens = getThemeTokens(lightMediumContrastTheme);
	const name: string = 'light-mc';

	exportFunction({ themeTokens, outputDirectory, name });
}

function exportLightHighContrastThemeTokens(
	outputDirectory: string,
	exportFunction: typeof exportThemeTokensToJson,
) {
	const themeTokens = getThemeTokens(lightHighContrastTheme);
	const name: string = 'light-hc';

	exportFunction({ themeTokens, outputDirectory, name });
}

function exportDarkThemeTokens(
	outputDirectory: string,
	exportFunction: typeof exportThemeTokensToJson,
) {
	const themeTokens = getThemeTokens(darkTheme);
	const name: string = 'dark';

	exportFunction({ themeTokens, outputDirectory, name });
}

function exportDarkMediumContrastThemeTokens(
	outputDirectory: string,
	exportFunction: typeof exportThemeTokensToJson,
) {
	const themeTokens = getThemeTokens(darkMediumContrastTheme);
	const name: string = 'dark-mc';

	exportFunction({ themeTokens, outputDirectory, name });
}

function exportDarkHighContrastThemeTokens(
	outputDirectory: string,
	exportFunction: typeof exportThemeTokensToJson,
) {
	const themeTokens = getThemeTokens(darkHighContrastTheme);
	const name: string = 'dark-hc';

	exportFunction({ themeTokens, outputDirectory, name });
}

export function exportThemeTokens() {
	const outputDirectory = CONFIG.DEFAULT_OUTPUT_DIRECTORY;

	exportLightThemeTokens(outputDirectory, exportThemeTokensToJson);
	exportLightMediumContrastThemeTokens(outputDirectory, exportThemeTokensToJson);
	exportLightHighContrastThemeTokens(outputDirectory, exportThemeTokensToJson);
	exportDarkThemeTokens(outputDirectory, exportThemeTokensToJson);
	exportDarkMediumContrastThemeTokens(outputDirectory, exportThemeTokensToJson);
	exportDarkHighContrastThemeTokens(outputDirectory, exportThemeTokensToJson);
}

export function exportPenpotThemeTokens() {
	const outputDirectory = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/penpot` as const;

	exportLightThemeTokens(outputDirectory, exportPenpotThemeTokensToJson);
	exportLightMediumContrastThemeTokens(outputDirectory, exportPenpotThemeTokensToJson);
	exportLightHighContrastThemeTokens(outputDirectory, exportPenpotThemeTokensToJson);
	exportDarkThemeTokens(outputDirectory, exportPenpotThemeTokensToJson);
	exportDarkMediumContrastThemeTokens(outputDirectory, exportPenpotThemeTokensToJson);
	exportDarkHighContrastThemeTokens(outputDirectory, exportPenpotThemeTokensToJson);
}
