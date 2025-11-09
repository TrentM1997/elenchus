import { motion, AnimatePresence } from "framer-motion";
import BSPost from "../Components/Post/BSPost";
import { getPopoverPost, selectPost } from "@/ReduxToolKit/Reducers/BlueSky/BlueSkySlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/ReduxToolKit/store";
import { useCallback } from "react";
import type { BlueSkyPost } from "@/ReduxToolKit/Reducers/BlueSky/BlueSkySlice";
import { softEase, variants } from "@/motion/variants";

export default function Scroller({ posts }) {
    const postForPopover = useSelector((s: RootState) => s.bluesky.popoverPost);
    const dispatch = useDispatch<AppDispatch>();

    const choosePost = useCallback((post: BlueSkyPost): void => {
        if (postForPopover !== null) return;
        const text: string = post.record?.text ?? null;
        dispatch(getPopoverPost(post));
        dispatch(selectPost(text));
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