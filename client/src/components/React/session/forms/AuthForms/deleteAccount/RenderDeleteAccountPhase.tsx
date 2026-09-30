import { DeleteAccountPhase } from "@/lib/hooks/auth/useDeleteAccountModalPhases";
import DeleteAccountForm from "./DeleteAccountForm";
import ProceedToFormOrCancel from "./ProceedToFormOrCancel";

export default function RenderDeleteAccountPhase({
  phase,
  choose,
}: {
  phase: DeleteAccountPhase;
  choose: (choice: "initial" | "proceed" | "cancel") => void;
}) {
  switch (phase.status) {
    case "initial": {
      return <ProceedToFormOrCancel choose={choose} />;
    }
    case "proceed": {
      return <DeleteAccountForm />;
    }
  }
}
