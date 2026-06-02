import * as fs from 'fs';
import type { Metadata, ThemeMetadata } from '../model/penpot-metadata';

export interface ExportPenpotMetadataToJsonParams {
	outputDirectory: string;
	metadata: Metadata;
	themeMetadata: ThemeMetadata[];
}

export function exportPenpotMetadataToJson({
	outputDirectory,
	metadata,
	themeMetadata,
}: ExportPenpotMetadataToJsonParams): void {
	const metadataFileName: string = `${outputDirectory}/$metadata.json`;
	fs.writeFileSync(metadataFileName, JSON.stringify(metadata, null, 2), {
		encoding: 'utf-8',
	});

	const themeMetadataFileName: string = `${outputDirectory}/$theme.json`;
	fs.writeFileSync(themeMetadataFileName, JSON.stringify(themeMetadata, null, 2), {
		encoding: 'utf-8',
	});
}
