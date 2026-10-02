import FeedbackOptIn from "../features/investigate/phase5/buttons/FeedbackOptIn";
import SaveInvestigation from "../features/investigate/phase5/buttons/SaveInvestigation";
import { useSaveInvestigation } from "@/lib/hooks/useHandleSaveInvestigation";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function RenderSaveInvestigationButtons() {
  const { status, handleSave } = useSaveInvestigation();

  switch (status) {
    case "initial":
    case "empty":
    case "pending":
    case "failed": {
      return <SaveInvestigation status={status} handleSave={handleSave} />;
    }
    case "ready": {
      return <FeedbackOptIn />;
    }

    default: {
      return assertNever(status);
    }
  }
}
