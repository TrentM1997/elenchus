import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import PendingExtractions from "../../features/investigate/phase3/components/notification/PendingExtractions";
import AuthNotification from "../../session/notifications/AuthNotification";

export default function ToastPipeline() {
  const toast = useSelector((s: RootState) => s.overlay.toast);

  if (!toast) return null;

  switch (toast.kind) {
    case "Extraction": {
      return <PendingExtractions />;
    }
    case "Auth": {
      return <AuthNotification toast={toast} />;
    }

    case null:
      return null;
    default: {
      return assertNever(toast);
    }
  }
}
