import type { AppDispatch, RootState } from "@/state/store";
import { useSelector, useDispatch } from "react-redux";
import { saveInvgestigation } from "@/state/Reducers/Investigate/research/thunks";
import { hydrateDashboard } from "@/state/Reducers/Dashboard/thunks";
import { SaveInvestigationState } from "@/state/Reducers/Investigate/research/types";

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
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async () => {
    if (research.phase !== "end") return;
    const result = await dispatch(saveInvgestigation(research.data));
    if (saveInvgestigation.fulfilled.match(result)) {
      dispatch(hydrateDashboard());
    }
  };

  return {
    handleSave,
    status,
  };
};
