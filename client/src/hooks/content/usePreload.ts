import type { Article } from "@/state/Reducers/Investigate/Reading";
import { useEffect, useCallback, useState } from "react";


interface UsePreloadReturn {
    displayed: Article | null,
    prev: Article | null
}

const usePreload = (articleData?: Article): UsePreloadReturn => {
    const [prev, setPrev] = useState<Article | null>(null);
    const [displayed, setDisplayed] = useState<Article | null>(null);


    const preload = useCallback((src: string) => {
        if (!src) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
        });
    }, []);

    useEffect(() => {
        if (!articleData) return;
        if (displayed && (articleData.article_url === displayed.article_url)) return;
        let cancelled = false;
        setPrev(displayed);

        (async () => {
            await preload(articleData.image_url);
            if (cancelled) return;
            setDisplayed(articleData);
        })();

        return () => {
            cancelled = true;
        };
    }, [articleData, displayed, preload]);

    return { displayed, prev };
};

export { usePreload };