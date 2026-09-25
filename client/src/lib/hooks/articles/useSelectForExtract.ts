import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  choose,
  discard,
  SelectedArticles,
} from "@/state/Reducers/Investigate/articles/ChosenArticles";
import { useCallback } from "react";
import { BrowsingOptionSchemaType } from "@elenchus/contracts/schemas/articles/BrowsingOptionSchema";

export const useSelectForExtract = () => {
  const pages = useSelector(
    (state: RootState) => state.investigation.search.pages,
  );
  const selected: SelectedArticles = useSelector(
    (state: RootState) => state.investigation.getArticle.selected,
  );
  const dispatch = useDispatch();
  const urlHash: Set<string> = useMemo(() => {
    if (selected.status === "empty") return new Set("");
    return new Set(selected.data?.map((a: BrowsingOptionSchemaType) => a.url));
  }, [selected]);

  const select = useCallback(
    (article: BrowsingOptionSchemaType) => {
      return () => {
        if (selected.status !== "empty" && urlHash.has(article.url)) {
          dispatch(discard(article));
        } else {
          dispatch(choose(article));
        }
      };
    },
    [selected, urlHash],
  );

  return {
    select,
    urlHash,
    pages,
  };
};
