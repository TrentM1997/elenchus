import { motion } from "framer-motion";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { variants } from "@/motion/variants";
import RenderMetricsCharts from "../UserCharts/ChartJsWrapper";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import { useRenderMetrics } from "@/hooks/useRenderMetrics";

export default function Metrics(): JSX.Element | null {
  const metrics = useSelector((s: RootState) => s.dash.metrics);
  const { priority1, priority2, priority3 } = useRenderMetrics();
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
        className="h-full w-full flex flex-col justify-start items-center gap-y-24 
            
            overflow-y-auto no-scrollbar scrollbar-gutter-stable-both scroll-smooth overscroll-contain"
      >
        <RenderMetricsCharts
          metrics={metrics}
          priority1={priority1}
          priority2={priority2}
          priority3={priority3}
        />
      </article>
    </motion.section>
  );
}
