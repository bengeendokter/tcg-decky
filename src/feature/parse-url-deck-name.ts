export function parseUrlDeckName(url: string): string {
    if (!URL.canParse(url)) {
        throw Error(`${url} is not a valid URL`);
    }

    const parsableUrl: URL = new URL(url);
    const pathName: string | undefined = parsableUrl.pathname.split('/').at(-1);

    if (!pathName) {
        throw Error(`Unable to parse deck name from URL: ${url}`);
    }

    return pathName.replace('_(TCG)', '').toLocaleLowerCase();
}