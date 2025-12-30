import { motion, AnimatePresence } from "framer-motion";
import BSPost from "../Components/Post/BSPost";
import { getPopoverPost, selectPost } from "@/state/Reducers/BlueSky/BlueSkySlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/state/store";
import { useCallback } from "react";
import type { BlueSkyPost } from "@/state/Reducers/BlueSky/BlueSkySlice";
import { softEase, variants } from "@/motion/variants";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { wait } from "@/lib/helpers/formatting/Presentation";

export default function Scroller({ posts }) {
    const postForPopover = useSelector((s: RootState) => s.bluesky.popoverPost);
    const dispatch = useDispatch<AppDispatch>();

    const choosePost = useCallback((post: BlueSkyPost) => {

        return async () => {
            if (postForPopover !== null) return;

            const text: string = post.record?.text ?? null;
            dispatch(getPopoverPost(post));
            dispatch(selectPost(text));
            await wait(400);
            dispatch(renderModal('Bluesky Post Selected'));
        }
    }, [postForPopover]);


    return (
        <AnimatePresence>
            {(Array.isArray(posts)) && (posts.length > 0) && <motion.div
                variants={variants}
                initial='closed'
                animate='open'
                exit='closed'
                transition={{ type: 'tween', duration: 0.3, ease: softEase, delay: 0.2 }}
            >
                {posts.map((post: any, index: number) => (
                    <BSPost key={post.record.text + index.toString()} post={post} choosePost={choosePost} />
                ))}
            </motion.div>}
        </AnimatePresence>
    )
}