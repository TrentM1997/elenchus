import { SetStateAction, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import {
  deleteSavedArticle,
  saveThisArticle,
} from "@/state/Reducers/Investigate/articles/thunks";
import { hydrateBookmarkRecords } from "@/state/Reducers/Dashboard/thunks";
import { BookmarkNotificationMessage } from "@/components/React/global/Articles/notifications/NotifySaved";

interface SaveArticleHook {
  handleSaveArticle: () => Promise<void>;
  setNotification: React.Dispatch<
    SetStateAction<BookmarkNotificationMessage | "idle">
  >;
  notification: BookmarkNotificationMessage | "idle";
}

interface SaveHookParams {
  articleId: ArticleSchemaType["id"];
  bookmarked: boolean;
}

export function useSaveArticle({
  articleId,
  bookmarked,
}: SaveHookParams): SaveArticleHook {
  const [notification, setNotification] = useState<
    BookmarkNotificationMessage | "idle"
  >("idle");
  const dispatch = useDispatch<AppDispatch>();

  const handleSaveArticle = useCallback(async (): Promise<void> => {
    try {
      if (bookmarked) {
        const result = await dispatch(deleteSavedArticle(articleId)).unwrap();
        if (!result.ok) {
          throw new Error("Bookmark delete attempt failed");
        }
        setNotification("unbookmarked");
      } else {
        const result = await dispatch(saveThisArticle(articleId)).unwrap();
        if (!result.ok) {
          throw new Error("Bookmark attempt failed");
        }
        setNotification("bookmarked");
      }
    } catch (err) {
      setNotification("issue syncing with user records");
      console.error(err);
    } finally {
      await dispatch(hydrateBookmarkRecords());
    }
  }, [dispatch, bookmarked, articleId]);

  return { handleSaveArticle, setNotification, notification };
}
