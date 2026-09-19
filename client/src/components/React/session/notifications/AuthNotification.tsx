import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Success from "./Success";
import Failed from "./Failed";
import Pending from "./Pending";
import { hideTop } from "@/motion/variants";
import { createPortal } from "react-dom";
import { AuthNotificationProps } from "@/env";
import { renderToast } from "@/state/Reducers/RenderingPipelines/PipelineSlice";

interface DeleteActions {
  pending: string;
  success: string;
  failed: string;
}

const deleteMessages: DeleteActions = {
  pending: "Deleting article",
  success: "Deleted successfully",
  failed: "Failed to delete",
};

export default function AuthNotification({ toast }: AuthNotificationProps) {
  useEffect(() => {
    if (toast.status === "success" || toast.status === "failed") {
      const timer = window.setTimeout(() => {
        renderToast({ status: "idle", kind: null });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [toast.status]);

  const deleteStatus: JSX.Element | null = (
    <p key={`delete${toast.status}`} className="text-white font-light text-sm">
      {toast.status === "pending" && deleteMessages.pending}
      {toast.status === "success" && deleteMessages.success}
      {toast.status === "failed" && deleteMessages.failed}
    </p>
  );

  const general: JSX.Element | null = (
    <p className="text-white font-light text-sm">{`${toast.kind} ${toast.status}`}</p>
  );

  const notification: JSX.Element | null = (
    <motion.div
      key="accountCreationNotification"
      variants={hideTop}
      initial="hide"
      animate="show"
      exit="hide"
      transition={{ type: "tween", duration: 0.2 }}
      className="fixed top-24 right-36 h-10 w-60 p-2 bg-mirage border border-zinc-700 rounded-xl px-2 z-[910]"
    >
      <div
        key="title"
        className="flex w-full h-full items-center justify-between"
      >
        <div key="titleContainer" className="w-auto h-fit">
          {toast.status !== "idle" && toast.action === "deleting"
            ? deleteStatus
            : general}
        </div>
        <div className="w-auto h-fit relative">
          {
            <AnimatePresence mode="wait">
              {status === "pending" && <Pending key={"pending-status"} />}
              {status === "success" && <Success key={"success-status"} />}
              {status === "failed" && <Failed key={"failed-status"} />}
            </AnimatePresence>
          }
        </div>
      </div>
    </motion.div>
  );

  return createPortal(notification, document.body);
}
