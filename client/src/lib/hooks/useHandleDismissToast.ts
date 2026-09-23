import {
  ActiveToast,
  renderToast,
} from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { AppDispatch } from "@/state/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useHandleDismissToast = (status: ActiveToast["status"]) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status !== "success" && status !== "failed") return;

    const executeDismissToast = window.setTimeout(() => {
      dispatch(renderToast({ status: "idle", kind: null }));
    }, 2000);

    return () => clearTimeout(executeDismissToast);
  }, [status, dispatch]);
};
