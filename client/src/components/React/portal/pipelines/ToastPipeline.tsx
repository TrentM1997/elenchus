import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import AuthNotification from "../../session/notifications/AuthNotification";

export default function ToastPipeline() {
  const toast = useSelector((s: RootState) => s.overlay.toast);

  if (!toast.kind) return null;

  return <AuthNotification status={toast.status} kind={toast.kind} />;
}
