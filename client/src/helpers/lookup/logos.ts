

export const LOGOS: Record<string, string> = (() => {
    const modules = import.meta.glob('../../../public/images/logos/*.{svg,png}', {
        eager: true,
        as: 'url',
    }) as Record<string, string>;

    const map: Record<string, string> = {};
    for (const [path, url] of Object.entries(modules)) {
        const filename = path.split('/').pop()!;
        const key = filename.replace(/\.(svg|png)$/i, '').toLowerCase();
        map[key] = url;
    }
    return map;
})();