import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";
import { saveThisArticle } from "@/state/Reducers/Investigate/articles/thunks";

interface SaveArticleHook {
  handleSaveArticle: () => Promise<void>;
}

interface SaveHookParams {
  article: ArticleSchemaType;
}

export function useSaveArticle({ article }: SaveHookParams): SaveArticleHook {
  const dispatch = useDispatch<AppDispatch>();

  const handleSaveArticle = useCallback(async (): Promise<void> => {
    try {
      await dispatch(saveThisArticle(article.id));
    } catch (err) {}
  }, [dispatch]);

  return { handleSaveArticle };
}
