import { CONFIG } from '@config';
import { darkHighContrastTheme, darkMediumContrastTheme, darkTheme, getThemeTokens, lightHighContrastTheme, lightMediumContrastTheme } from '../model/theme';
import { exportThemeTokensToJson } from '../data-access/export-theme-tokens-to-json';

const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;

export function main() {
	// const themeTokens = getThemeTokens(lightTheme);
	// const name: string = 'light';

	// const themeTokens = getThemeTokens(lightMediumContrastTheme);
	// const name: string = 'light-mc';

	// const themeTokens = getThemeTokens(lightHighContrastTheme);
	// const name: string = 'light-hc';

	// const themeTokens = getThemeTokens(darkTheme);
	// const name: string = 'dark';

	// const themeTokens = getThemeTokens(darkMediumContrastTheme);
	// const name: string = 'dark-mc';

	const themeTokens = getThemeTokens(darkHighContrastTheme);
	const name: string = 'dark-hc';

	console.log(themeTokens);
	exportThemeTokensToJson({ themeTokens, outputDirectory, name });
}
