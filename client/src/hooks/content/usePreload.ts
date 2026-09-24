import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { useEffect, useCallback, useState } from "react";

interface UsePreloadReturn {
  displayed: ArticleSchemaType | null;
  prev: ArticleSchemaType | null;
}

const usePreload = (articleData?: ArticleSchemaType): UsePreloadReturn => {
  const [prev, setPrev] = useState<ArticleSchemaType | null>(null);
  const [displayed, setDisplayed] = useState<ArticleSchemaType | null>(null);

  const preload = useCallback((src: string | undefined | null) => {
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
    if (displayed && articleData.article_url === displayed.article_url) return;
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
