import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { useEffect } from "react";
import { hydrateOpenedArticle } from "@/state/Reducers/Dashboard/thunks";
import { clearOpenedArticle } from "@/state/Reducers/Dashboard/DashboardSlice";

export const useHydrateOpenedArticle = (articleId: ArticleSchemaType["id"]) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const request = dispatch(hydrateOpenedArticle(articleId));

    return () => {
      request.abort();
      dispatch(clearOpenedArticle());
    };
  }, [dispatch, articleId]);
};
