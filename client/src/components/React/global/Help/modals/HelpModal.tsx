import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { variants } from "@/motion/variants";
import HelpModalTopRail from "./HelpModalTopRail";
import HelpModalInfo from "./HelpModalInfo";

export default function HelpModal({
  info,
  setActiveTab,
  activeTab,
}: HelpModal) {
  useEffect(() => {
    setActiveTab("tabOne");
  }, [info, setActiveTab]);

  const modal = (
    <motion.div
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-[900] flex items-end justify-center bg-black/40 px-3 pb-6 pt-6 backdrop-blur-sm sm:px-6 sm:pb-12"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "tween", duration: 0.2 }}
        className="relative flex max-h-[85dvh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-mirage to-ebony shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      >
        <HelpModalTopRail
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          info={info}
        />

        <HelpModalInfo activeTab={activeTab} info={info} />
      </motion.div>
    </motion.div>
  );
  return createPortal(modal, document.body);
}
