import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";
import HelpModalTabs from "./HelpModalTabs";
import { getHelpModalStatus } from "@/state/Reducers/Investigate/pov/StepSlice";

export default function HelpModalTopRail({
  info,
  activeTab,
  setActiveTab,
}: HelpModal) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className="relative shrink-0 border-b border-white/10 px-5 pb-4 pt-6 sm:px-7">
      <p className="mb-3 pr-12 text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
        Guidance
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
      <HelpModalTabs
        info={info}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </header>
  );
}
