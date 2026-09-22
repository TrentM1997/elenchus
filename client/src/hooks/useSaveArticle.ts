import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";
import { saveThisArticle } from "@/state/Reducers/Investigate/articles/thunks";

interface SaveArticleHook {
  handleSaveArticle: () => Promise<void>;
  status: "bookmarked" | "unbookmarked";
}

interface SaveHookParams {
  article: ArticleSchemaType;
}

export function useSaveArticle({ article }: SaveHookParams): SaveArticleHook {
  const [status, setStatus] = useState<"bookmarked" | "unbookmarked">(
    "unbookmarked",
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleSaveArticle = useCallback(async (): Promise<void> => {
    try {
      const result = await dispatch(saveThisArticle(article.id)).unwrap();
      if (result.ok) {
        setStatus("bookmarked");
      }
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return { handleSaveArticle, status };
}
