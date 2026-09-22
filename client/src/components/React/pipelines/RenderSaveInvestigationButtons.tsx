import GoToDashboard from "../features/investigate/phase5/buttons/GoToDashboard";
import SaveInvestigation from "../features/investigate/phase5/buttons/SaveInvestigation";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useSaveInvestigation } from "@/lib/hooks/useHandleSaveInvestigation";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function RenderSaveInvestigationButtons() {
  const { status, handleSave } = useSaveInvestigation();
  const state = useSelector(
    (s: RootState) => s.investigation.research.persistence,
  );

  switch (status) {
    case "empty":
    case "initial":
    case "pending":
    case "failed": {
      return (
        <SaveInvestigation status={state.status} handleSave={handleSave} />
      );
    }
    case "ready": {
      return <GoToDashboard />;
    }

    default: {
      return assertNever(status);
    }
  }
}
