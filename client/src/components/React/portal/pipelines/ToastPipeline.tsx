import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import AuthNotification from "../../session/notifications/AuthNotification";
import { useHandleDismissToast } from "@/lib/hooks/useHandleDismissToast";

export default function ToastPipeline() {
  const toast = useSelector((s: RootState) => s.overlay.toast);
  useHandleDismissToast(toast.status);

  if (!toast.kind) return null;

  return <AuthNotification status={toast.status} kind={toast.kind} />;
}
