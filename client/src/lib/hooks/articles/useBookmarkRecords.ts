import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";
import { BookmarkSchemaType } from "@elenchus/contracts/schemas/articles/BookmarkSchema";
import { useEffect, useMemo, useRef } from "react";

export type BookmarkedArticlesSet = Set<BookmarkSchemaType["article_id"]>;

export const useBookmarkRecords = (): {
  articlesBookmarked: BookmarkedArticlesSet;
} => {
  const bookmarkRecords = useSelector((s: RootState) => s.dash.bookmarks);

  const previousSet = useRef<BookmarkedArticlesSet>(new Set());

  const currentSet = useMemo(() => {
    if (bookmarkRecords.status === "ready") {
      return new Set(bookmarkRecords.data.map((record) => record.article_id));
    }

    if (bookmarkRecords.status === "empty") {
      return new Set<number>();
    }

    return null;
  }, [bookmarkRecords]);

  useEffect(() => {
    if (currentSet !== null) {
      previousSet.current = currentSet;
    }
  }, [currentSet]);

  const articlesBookmarked = currentSet ?? previousSet.current;

  return { articlesBookmarked };
};
