import { AnimatePresence, motion } from "framer-motion";
import BlueSkyLoader from "../Loaders/BlueSkyLoader";
import { variants } from "@/motion/variants";
import { PostsProps } from "@/env";
import Feed from "../Components/feed/Feed";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";

export default function FeedContainer({ posts }: PostsProps) {
  return (
    <motion.div
      key="postfeed"
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.3 }}
      className="h-full"
    >
      <div className="relative min-h-screen w-full">
        <AnimatePresence mode="wait">
          <AsyncStateRenderer
            state={posts}
            pending={() => <BlueSkyLoader key={"bluesky-loader"} />}
          >
            {(state) => <Feed posts={state} />}
          </AsyncStateRenderer>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
