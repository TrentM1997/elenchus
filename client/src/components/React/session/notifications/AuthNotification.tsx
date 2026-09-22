import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import Success from "./Success";
import Failed from "./Failed";
import Pending from "./Pending";
import { hideTop } from "@/motion/variants";
import { createPortal } from "react-dom";
import { ActiveToast } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { createToastMessage } from "@/lib/helpers/toasts/createToastMessage";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { useHandleDismissToast } from "@/lib/hooks/useHandleDismissToast";

export default function AuthNotification({
  status,
  kind,
}: {
  status: ActiveToast["status"];
  kind: ActiveToast["kind"];
}) {
  useHandleDismissToast(status);

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
        <ActiveToastMessage message={createToastMessage({ kind, status })} />
        <ActiveToastAnimation status={status} />
      </div>
    </motion.div>
  );

  return createPortal(notification, document.body);
}

function ActiveToastMessage({
  message,
}: {
  message: string;
}): React.JSX.Element {
  return (
    <div key="titleContainer" className="w-auto h-fit">
      {message}
    </div>
  );
}

function ActiveToastAnimation({ status }: { status: ActiveToast["status"] }) {
  return (
    <div className="w-auto h-fit relative">
      <AnimatePresence mode="wait">
        <RenderToastAnimation status={status} />
      </AnimatePresence>
    </div>
  );
}

function RenderToastAnimation({ status }: { status: ActiveToast["status"] }) {
  switch (status) {
    case "idle": {
      return null;
    }
    case "pending": {
      return <Pending key={"pending-status"} />;
    }
    case "success": {
      return <Success key={"success-status"} />;
    }
    case "failed": {
      return <Failed key={"failed-status"} />;
    }

    default: {
      return assertNever(status);
    }
  }
}
