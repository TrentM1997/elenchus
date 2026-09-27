import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/state/store";
import { extractArticles } from "@/state/Reducers/Investigate/articles/thunks";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { wait } from "@/lib/helpers/formatting/Presentation";
import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import { UserKind } from "@/state/Reducers/Athentication/Authentication";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { hydrateBookmarkRecords } from "@/state/Reducers/Dashboard/thunks";

type ExtractSelectedArticlesHook = {
  executeExtraction: () => Promise<void>;
  dontExecute: () => void;
  status: SelectedArticles["status"];
};

export const useExtractTheseArticles = (): ExtractSelectedArticlesHook => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const selected = useSelector(
    (state: RootState) => state.investigation.getArticle.selected,
  );
  const dispatch = useDispatch<AppDispatch>();

  const retrieveArticles = (): void => {
    if (selected.status === "empty") return;
    dispatch(extractArticles(toExtractableArticles(selected.data)));
  };

  const callByUserKind = (kind: UserKind): void => {
    switch (kind) {
      case "anonymous":
        break;
      case "authenticated":
        dispatch(hydrateBookmarkRecords());
        break;
      default:
        return assertNever(kind);
    }

    retrieveArticles();
  };

  function toExtractableArticles(
    selected: Extract<
      SelectedArticles,
      { status: "partial" } | { status: "max" }
    >["data"],
  ): SelectedArticle[] {
    return selected.map((item) => {
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
  }

  const executeExtraction = async () => {
    if (selected.status === "empty" || selected.data.length === 0) return;
    callByUserKind(userKind);
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
