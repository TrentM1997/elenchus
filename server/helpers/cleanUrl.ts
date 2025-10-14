export const cleanURL = (url: string): string => {
    try {
        const u = new URL(url);
        // Remove *only* known tracking params — keep important ones.
        const dropParams = [
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'fbclid', 'gclid', 'igshid', 'mc_cid', 'mc_eid'
        ];
        for (const key of dropParams) {
            u.searchParams.delete(key);
        }
        u.hash = ''; // strip anchors like #comments
        return u.toString();
    } catch {
        return url;
    }
};
