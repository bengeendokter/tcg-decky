export async function getPage(url: string): Promise<string> {
	return await fetch(url).then((result) => result.text());
}
