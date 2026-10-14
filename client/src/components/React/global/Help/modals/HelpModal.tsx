import { motion, AnimatePresence } from "framer-motion";
import { getHelpModalStatus } from "@/state/Reducers/Investigate/pov/StepSlice";
import { useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import { variants } from "@/motion/variants";

export default function HelpModal({
  info,
  setActiveTab,
  activeTab,
}: HelpModal) {
  const dispatch = useDispatch();

  useEffect(() => {
    setActiveTab("tabOne");
  }, [info, setActiveTab]);

  const selectedTab =
    activeTab === "tabTwo" && "tabTwo" in info ? "tabTwo" : "tabOne";
  const content =
    selectedTab === "tabTwo" && "tabTwo" in info ? info.tabTwo : info.tabOne;
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
        <header className="relative shrink-0 border-b border-white/10 px-5 pb-4 pt-6 sm:px-7">
          <p className="mb-5 pr-12 text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
            A little guidance
          </p>
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ type: "tween", duration: 0.2 }}
            onClick={() => dispatch(getHelpModalStatus("closed"))}
            className="absolute right-4 top-4 h-9 w-9 cursor-pointer rounded-full border border-white/10 bg-white/5 p-2.5 transition-colors duration-200 hover:bg-white/10 sm:right-5"
          >
            <svg
              className="text-zinc-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="100%"
              height="100%"
            >
              <path
                d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z"
                fill="currentColor"
              />
            </svg>
          </motion.div>
          <ul className="flex flex-wrap items-stretch gap-2">
            {(["tabOne", "tabTwo"] as const).map((tab) => {
              const element =
                tab === "tabOne"
                  ? info.tabOne
                  : "tabTwo" in info
                    ? info.tabTwo
                    : undefined;
              if (!element) return null;
              return (
                <motion.li
                  className="min-w-0 cursor-pointer"
                  key={tab}
                  initial={false}
                  animate={{
                    opacity: tab === selectedTab ? 1 : 0.5,
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  <h1
                    className={`h-full rounded-xl border px-3.5 py-2.5 text-sm font-medium leading-snug transition-colors duration-200 sm:text-base ${tab === selectedTab ? "border-sky-300/25 bg-sky-300/10 text-sky-100" : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"}`}
                  >
                    {element.heading}
                  </h1>
                </motion.li>
              );
            })}
          </ul>
        </header>

        <main className="relative min-h-0 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7 sm:py-7">
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
      </motion.div>
    </motion.div>
  );
  return createPortal(modal, document.body);
}
