import { useSelector } from "react-redux"
import type { RootState } from "@/ReduxToolKit/store"
import { motion } from "framer-motion"
import { delays } from "@/motion/variants"
import ScrolltoTop from "@/helpers/ScrollToTop"
import NoSavedArticles from "../fallbacks/NoSavedArticles"
import ArticlesScroller from "./ArticlesScroller";
import { useMemo, useState } from "react"
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading"

export default function SavedArticles({ }) {
    const userArticles = useSelector((state: RootState) => state.userdata.userArticles);
    const hasArticles: boolean = Array.isArray(userArticles) && (userArticles.length > 0);
    const sortedArticles = useMemo(() => {
        const artcs = userArticles
            ? userArticles.slice()
            : null;
        const sorted = artcs?.sort((a: Article, b: Article) => b.id - a.id);
        return sorted;
    }, []);
    const restorePosition = useSelector((state: RootState) => state.profileNav.articleScrollPosition);
    const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
    const markIds = (id: number, deleted: boolean) => {
        setDeletedIds(prev => {
            const next = new Set(prev);
            deleted ? next.add(id) : next.delete(id);
            return next;
        });
    };


    return (
        <motion.section
            variants={delays}
            initial='closed'
            animate='open'
            exit='closed'
            className="w-auto  md:w-full h-fit lg:px-10 xl:px-12 2xl:px-16 mx-auto">
            <ScrolltoTop />
            <div
                className="w-full md:px-0 2xl:px-2 gap-3 h-full md:mt-12 xl:mt-4 flex justify-center md:justify-end">

                {hasArticles ? <ArticlesScroller sortedArticles={sortedArticles} markIds={markIds} deletedIds={deletedIds} restorePosition={restorePosition}
                /> : <NoSavedArticles key={'noSavedArticles'} />}
            </div>

        </motion.section>
    );
};


