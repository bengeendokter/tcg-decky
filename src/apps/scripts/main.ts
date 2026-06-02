import { exportPenpotMetadata } from '@style/feature/export-penpot-metadata';
import {
	exportPaletteTokens,
	exportPenpotPaletteTokens,
} from '@style/feature/export-palette-tokens';
import { exportPenpotThemeTokens, exportThemeTokens } from '@style/feature/export-theme-tokens';

exportPaletteTokens();
exportThemeTokens();

exportPenpotPaletteTokens();
exportPenpotThemeTokens();
exportPenpotMetadata();
