import { useCallback, useState } from "react";
import { serverClient } from "@/lib/services/client/serverClient";
import { wait } from "@/lib/helpers/formatting/Presentation";
import { createInitialBookmarkStates } from "@/lib/helpers/createInitialBookmarkStates";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
const service = serverClient.privileged.user.write;

export type BookmarkStatus =
  | "bookmarked"
  | "bookmarking"
  | "unbookmarked"
  | "unbookmarking";

export type InitialBookmarkStatus = Extract<
  BookmarkStatus,
  "bookmarked" | "unbookmarked"
>;

export type BookmarkState = {
  status: BookmarkStatus;
};

export type BookmarkStates = Record<ArticleSchemaType["id"], BookmarkState>;

type UseHandleBookmarkHook = {
  deleteBookmark: (article: ArticleSchemaType) => () => Promise<void>;
  bookmarks: BookmarkStates;
};

export const useHandleBookmark = ({
  articles,
}: {
  articles: ArticleSchemaType[];
}): UseHandleBookmarkHook => {
  const [bookmarks, setBookmarks] = useState<BookmarkStates>(() =>
    createInitialBookmarkStates({
      articles,
      initialStatus: "bookmarked",
    }),
  );

  const updateBookmark = useCallback(
    (status: BookmarkStatus, article_id: ArticleSchemaType["id"]) => {
      setBookmarks((current) => ({
        ...current,
        [article_id]: {
          status,
        },
      }));
    },
    [],
  );

  const deleteBookmark = useCallback(
    (article: ArticleSchemaType) => {
      return async () => {
        updateBookmark("unbookmarking", article.id);

        try {
          const result = await service.unBookmark(String(article.id));

          if (result.ok === false) {
            throw new Error(
              `Unexpected error: ${result.message} | ${result.details}`,
            );
          }

          updateBookmark("unbookmarked", article.id);
        } catch (err) {
          updateBookmark("bookmarked", article.id);
          console.error(err);
        } finally {
          await wait(1200);
        }
      };
    },
    [service, updateBookmark],
  );

  return {
    deleteBookmark,
    bookmarks,
  };
};
