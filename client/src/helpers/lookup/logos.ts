export const LOGOS: Record<string, string> = (() => {
    const modules = import.meta.glob('../../../public/images/logos/*.{svg,png}', {
        eager: true,
        as: 'url',           // get final URL string
    }) as Record<string, string>;

    const map: Record<string, string> = {};
    for (const [path, url] of Object.entries(modules)) {
        const filename = path.split('/').pop()!;             // e.g. "cbs-news.svg"
        const key = filename.replace(/\.(svg|png)$/i, '').toLowerCase();
        map[key] = url;                                      // url is already a string
    }
    return map;
})();
