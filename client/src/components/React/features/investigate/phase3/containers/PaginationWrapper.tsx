import { motion } from "framer-motion";
import StoryPaginate from "../components/buttons/StoryPaginate";
import type { Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import type { RootState } from "@/ReduxToolKit/store";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { useSelector } from "react-redux";

export default function ArticlePagination(): JSX.Element | null {
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
    const articles: Article[] = useSelector((state: RootState) => state.investigation.read.articles)
    const canAnimate: boolean = (articles.length > 0) && (phase === 'Phase 3');

    const paginationHero: JSX.Element = (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'tween', duration: 0.3, delay: 0.2 }}
            key="spacer-div"
            className="flex items-center w-full h-44 md:h-52 justify-center relative"
        >
            <StoryPaginate />
        </motion.div>
    );

    if (canAnimate) return paginationHero;

    return null;
};