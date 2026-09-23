import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/state/store";
import { extractArticles } from "@/state/Reducers/Investigate/articles/thunks";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { wait } from "@/lib/helpers/formatting/Presentation";
import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";

type ExtractSelectedArticlesHook = {
  executeExtraction: () => Promise<void>;
  dontExecute: () => void;
  status: SelectedArticles["status"];
};

export const useExtractTheseArticles = (): ExtractSelectedArticlesHook => {
  const selected = useSelector(
    (state: RootState) => state.investigation.getArticle.selected,
  );
  const dispatch = useDispatch<AppDispatch>();
  const retrieveArticles = (): void => {
    if (selected.status !== "empty") {
      const articles: SelectedArticle[] = selected.data.map((item) => {
        return {
          url: item.url,
          source: item.provider,
          date: item.date_published,
          logo: item.logo ?? "",
          title: item.name,
          image: item.image ?? "",
          description: item.description,
        };
      });

      dispatch(extractArticles(articles));
    }
  };

  const executeExtraction = async () => {
    if (selected.status === "empty" || selected.data.length === 0) return;
    retrieveArticles();
    await wait(400);
    dispatch(renderModal(null));
  };

  const dontExecute = () => {
    dispatch(renderModal(null));
  };

  return {
    executeExtraction,
    dontExecute,
    status: selected.status,
  };
};
