import { useSelector } from "react-redux"
import type { RootState } from "@/ReduxToolKit/store"
import { motion } from "framer-motion"
import { delays } from "@/motion/variants"
import ScrolltoTop from "@/helpers/ScrollToTop"
import NoSavedArticles from "../fallbacks/NoSavedArticles"
import ArticlesScroller from "./ArticlesScroller";
import { useEffect, useMemo, useRef, useState } from "react"
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/ReduxToolKit/store"
import { populateArticles, refreshArticlesStored } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer"

export default function SavedArticles({ }) {
    const userArticles: Article[] = useSelector((state: RootState) => state.userdata.userArticles);
    const hasArticles: boolean = Array.isArray(userArticles) && (userArticles.length > 0);
    const restorePosition = useSelector((state: RootState) => state.profileNav.articleScrollPosition);
    const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
    const dispatch = useDispatch<AppDispatch>();
    const isUnmountingRef = useRef<boolean | null>(null);
    const persistedArticles: Article[] | null = useMemo(() => {

        const filtered: Article[] = userArticles.filter((article: Article) => !deletedIds.has(article.id));
        return filtered;
    }, [deletedIds, userArticles]);
    const markIds = (id: number, deleted: boolean) => {
        setDeletedIds(prev => {
            const next = new Set(prev);
            deleted ? next.add(id) : next.delete(id);
            return next;
        });
    };

    useEffect(() => {

        return () => {
            isUnmountingRef.current = true;
        }
    }, [])


    useEffect(() => {

        return () => {
            if (isUnmountingRef.current === true) {
                dispatch(refreshArticlesStored(persistedArticles));
            }
        }
    }, [persistedArticles]);


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

                {hasArticles ? <ArticlesScroller sortedArticles={userArticles} markIds={markIds} deletedIds={deletedIds} restorePosition={restorePosition}
                /> : <NoSavedArticles key={'noSavedArticles'} />}
            </div>

        </motion.section>
    );
};


