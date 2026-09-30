import { motion } from "framer-motion";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { variants } from "@/motion/variants";
import { useScrollWithShadow } from "@/lib/hooks/rendering/useScrollWithShadow";
import RenderCharts from "../UserCharts/RenderCharts";

export default function ResearchMetrics(): JSX.Element | null {
  const metrics = useSelector((s: RootState) => s.dash.metrics);
  const { boxShadow, onScrollHandler } = useScrollWithShadow();

  return (
    <motion.section
      variants={variants}
      initial={false}
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.2 }}
      className="w-auto mx-auto h-[94.5%] relative mt-6
             2xl:mx-52 grow p-4 md:p-0"
    >
      <ScrolltoTop />

      <article
        onScroll={onScrollHandler}
        style={{ boxShadow: boxShadow }}
        className="h-full w-full flex flex-col py-16 items-center gap-y-24 
            overflow-y-auto no-scrollbar scrollbar-gutter-stable-both scroll-smooth overscroll-contain"
      >
        <RenderCharts metrics={metrics} />
      </article>
    </motion.section>
  );
}
