import { motion, AnimatePresence } from "framer-motion";
import Pages from "./Pages";
import { searchResultsVariants } from "@/motion/variants";
import SelectLinks from "../components/selection/containers/SelectLinks";

export default function SearchResults() {
  return (
    <motion.div
      key="linkGridContainer"
      variants={searchResultsVariants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.2 }}
      className="h-full w-full min-h-screen grow pt-4 mb-44 md:mb-0"
    >
      <div className="h-full w-full flex flex-col justify-start items-center mx-auto relative">
        <AnimatePresence mode="wait">
          <Pages key={"pages"} />
        </AnimatePresence>
      </div>

      <SelectLinks />
    </motion.div>
  );
}
