import type { AppDispatch, RootState } from "@/state/store";
import { useSelector, useDispatch } from "react-redux";
import { saveInvgestigation } from "@/state/Reducers/Investigate/research/thunks";
import type {
  SaveInvestigationState,
  UserResearchType,
} from "@/state/Reducers/Investigate/research/types";
import { ArticleExtractionState } from "@/state/Reducers/Investigate/articles/types";

type SaveInvestigationHook = {
  handleSave: () => Promise<void>;
  status: SaveInvestigationState["status"];
};

export const useSaveInvestigation = (): SaveInvestigationHook => {
  const status = useSelector(
    (state: RootState) => state.investigation.research.persistence.status,
  );
  const research = useSelector(
    (state: RootState) => state.investigation.research.research,
  );
  const articles = useSelector((s: RootState) => s.investigation.read.articles);
  const dispatch = useDispatch<AppDispatch>();
  const getPayload = ({
    research,
    articles,
  }: {
    research: Extract<UserResearchType, { phase: "end" }>;
    articles: Extract<ArticleExtractionState, { status: "ready" }>;
  }) => {
    const articleIds = articles.data.retrieved.map((article) => article.id);
    if (!research.data.context.notes) {
      return {
        research: research.data,
        articleIds,
        extracts: research.data.context.extracts,
      };
    } else {
      return {
        research: research.data,
        articleIds,
        extracts: research.data.context.extracts,
        notes: research.data.context.notes,
      };
    }
  };

  const handleSave = async () => {
    if (research.phase !== "end" || articles.status !== "ready") return;
    const payload = getPayload({ research, articles });
    await dispatch(saveInvgestigation(payload));
  };

  return {
    handleSave,
    status,
  };
};
