import { toastMessageConfig } from "@/lib/tokens/toastMessages";
import { ActiveToast } from "@/state/Reducers/RenderingPipelines/PipelineSlice";

export function createToastMessage({
  kind,
  status,
}: {
  kind: ActiveToast["kind"];
  status: ActiveToast["status"];
}): string {
  if (!kind) return "N/A";

  const toastActive = toastMessageConfig[kind];

  return toastActive[status];
}
