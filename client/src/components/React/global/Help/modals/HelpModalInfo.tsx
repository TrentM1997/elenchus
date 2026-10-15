import { motion, AnimatePresence } from "framer-motion";

export default function HelpModalInfo({
  info,
  activeTab,
}: Pick<HelpModal, "info" | "activeTab">) {
  const selectedTab =
    activeTab === "tabTwo" && "tabTwo" in info ? "tabTwo" : "tabOne";
  const content =
    selectedTab === "tabTwo" && "tabTwo" in info ? info.tabTwo : info.tabOne;

  return (
    <main className="relative min-h-60 overflow-y-auto overscroll-contain no-scrollbar px-5 py-6 sm:px-7 sm:py-7">
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          key={content.heading}
          initial={{ y: 100, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.5, duration: 0.2 },
          }}
          exit={{ y: 100, opacity: 0, transition: { duration: 0.2 } }}
        >
          <p className="text-base font-normal leading-relaxed text-zinc-200 sm:text-lg sm:leading-relaxed">
            {content.explanation}
          </p>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
