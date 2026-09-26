import type { AppDispatch, RootState } from "@/state/store";
import { useSelector, useDispatch } from "react-redux";
import { saveInvgestigation } from "@/state/Reducers/Investigate/research/thunks";
import type { SaveInvestigationState } from "@/state/Reducers/Investigate/research/types";

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

  const handleSave = async () => {
    if (research.phase !== "end" || articles.status !== "ready") return;
    const articleIds = articles.data.retrieved.map((article) => article.id);
    await dispatch(saveInvgestigation({ research: research.data, articleIds }));
  };

  return {
    handleSave,
    status,
  };
};
