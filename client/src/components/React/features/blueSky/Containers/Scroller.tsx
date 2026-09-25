import { motion, AnimatePresence } from "framer-motion";
import BSPost from "../Components/Post/BSPost";
import { selectPost } from "@/state/Reducers/BlueSky/BlueSkySlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";
import { useCallback } from "react";
import { softEase, variants } from "@/motion/variants";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { BlueSkyPostSchemaType } from "@elenchus/contracts/schemas/integrations/BlueSkySchemas";

export default function Scroller({
  posts,
}: {
  posts: BlueSkyPostSchemaType[];
}) {
  const dispatch = useDispatch<AppDispatch>();

  const choosePost = useCallback(
    (post: BlueSkyPostSchemaType) => {
      return async () => {
        dispatch(selectPost({ status: "ready", data: post }));
        dispatch(renderModal("Bluesky Post Selected"));
      };
    },
    [dispatch],
  );

  return (
    <AnimatePresence>
      {Array.isArray(posts) && posts.length > 0 && (
        <motion.div
          variants={variants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{
            type: "tween",
            duration: 0.3,
            ease: softEase,
            delay: 0.2,
          }}
        >
          {posts.map((post: any, index: number) => (
            <BSPost
              key={post.record.text + index.toString()}
              post={post}
              choosePost={choosePost}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
