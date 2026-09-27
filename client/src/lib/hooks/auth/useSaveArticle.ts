import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import {
  deleteSavedArticle,
  saveThisArticle,
} from "@/state/Reducers/Investigate/articles/thunks";
import { hydrateBookmarkRecords } from "@/state/Reducers/Dashboard/thunks";

interface SaveArticleHook {
  handleSaveArticle: () => Promise<void>;
}

interface SaveHookParams {
  article: ArticleSchemaType;
  bookmarked: boolean;
}

export function useSaveArticle({
  article,
  bookmarked,
}: SaveHookParams): SaveArticleHook {
  const dispatch = useDispatch<AppDispatch>();

  const handleSaveArticle = useCallback(async (): Promise<void> => {
    try {
      if (bookmarked) {
        const result = await dispatch(deleteSavedArticle(article.id)).unwrap();
        if (!result.ok) {
          throw new Error("Bookmark delete attempt failed");
        }
      } else {
        const result = await dispatch(saveThisArticle(article.id)).unwrap();
        if (!result.ok) {
          throw new Error("Bookmark attempt failed");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      await dispatch(hydrateBookmarkRecords());
    }
  }, [dispatch, bookmarked]);

  return { handleSaveArticle };
}
