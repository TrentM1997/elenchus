import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { RootState } from "@/state/store";
import Scroller from "../../Containers/Scroller";
import { variants } from "@/motion/variants";
import { SplitBlueSkyFeed } from "@/lib/services/hydrateBlueSkyService";

type FeedProps = {
  posts: SplitBlueSkyFeed;
  shouldAnimate?: boolean;
};

export default function Feed({
  posts,
  shouldAnimate = true,
}: FeedProps): JSX.Element {
  const selected = useSelector((state: RootState) => state.bluesky.selected);
  const postForPopover = useSelector((s: RootState) => s.bluesky.popoverPost);
  const playAnimation = shouldAnimate && !postForPopover;

  return (
    <motion.div
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
      className="relative mx-auto px-4 lg:px-16 overflow-y-hidden"
    >
      <div
        style={{
          animationPlayState:
            selected.status === "ready" && shouldAnimate ? "paused" : "running",
        }}
        className="items-center space-x-6 pb-12 lg:pb-0 lg:space-x-8 animate-scroller2 group
          md:animate-none relative lg:px-4 mx-auto grid grid-cols-1 lg:grid-cols-2"
      >
        <div
          style={{ transform: "translateZ(0)" }}
          className={`relative transform-gpu will-change-transform [contain:layout_paint] backface-hidden flex-shrink-0 h-full items-center animate-scroller2 
            ${playAnimation ? "animation-running md:hover:animation-paused" : "animation-paused"}
          `}
        >
          <Scroller posts={posts.firstHalf} />
        </div>
        <div
          style={{ transform: "translateZ(0)" }}
          className={`relative transform-gpu will-change-transform [contain:layout_paint] backface-hidden flex-shrink-0 h-full items-center animate-scroller 
              ${playAnimation ? "animation-running md:hover:animation-paused" : "animation-paused"}
          
          `}
        >
          <Scroller posts={posts.secondHalf} />
        </div>
      </div>
    </motion.div>
  );
}
