import FailedNotification from "./FailedNotification";
import { motion, AnimatePresence } from "framer-motion";
import { FailedAttempt } from "@/lib/services/types";
import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";

export default function FailedLoading({
  failed,
}: {
  failed: FailedAttempt[];
}): JSX.Element | null {
  const dismissed = useSelector(
    (state: RootState) => state.investigation.read.dismissedFailureUrls,
  );
  return (
    <motion.ul
      initial={{ opacity: 0, y: -100 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.8, duration: 1, ease: [0.2, 0.6, 0.2, 1] },
      }}
      exit={{ opacity: 0 }}
      className="2xl:top-20 2xl:right-6 sm:top-16 bottom-20 right-2 flex fixed z-20 flex-col gap-y-6"
    >
      <AnimatePresence initial={false}>
        {failed.filter((notification) => !dismissed.includes(notification.article_url)).map((notification) => (
          <FailedNotification
            key={notification.article_url}
            notification={notification}
          />
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
