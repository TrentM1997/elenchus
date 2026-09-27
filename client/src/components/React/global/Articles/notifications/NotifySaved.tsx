import { motion } from "framer-motion";
import { SetStateAction, useEffect } from "react";
import { scaleUpDown } from "@/motion/variants";

export type BookmarkNotificationMessage =
  | "bookmarked"
  | "unbookmarked"
  | "issue syncing with user records";

export default function NotifySavedArticle({
  setNotification,
  message,
}: {
  setNotification: React.Dispatch<
    SetStateAction<BookmarkNotificationMessage | "idle">
  >;
  message: BookmarkNotificationMessage;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setNotification("idle");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      key="actionNotified"
      variants={scaleUpDown}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.2 }}
      className="absolute z-50 xl:right-8 bottom-0 right-8 bg-white rounded-lg h-auto w-auto flex flex-col items-center
                border border-astro_gray shadow-thick"
    >
      <div className="w-full h-auto p-2">
        <h1 className="text-black text-nowrap text-sm w-full font-light tracking-tight">
          {message}
        </h1>
      </div>
    </motion.div>
  );
}
