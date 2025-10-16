import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/ReduxToolKit/store"
import { motion } from "framer-motion"
import { delays } from "@/motion/variants"
import { useCallback } from "react"
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading"
import { readSavedArticle } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer"
import { presentThisArticle } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice"
import ScrolltoTop from "@/helpers/ScrollToTop"
import NoSavedArticles from "../fallbacks/NoSavedArticles"
import ArticlesScroller from "./ArticlesScroller";

export default function SavedArticles({ }) {
    const userArticles = useSelector((state: RootState) => state.userdata.userArticles);
    const hasArticles: boolean = Array.isArray(userArticles) && (userArticles.length > 0);
    const dispatch = useDispatch<AppDispatch>();

    const handleArticleSelection = useCallback((article: Article) => () => {
        dispatch(readSavedArticle(article));
        dispatch(presentThisArticle());
    }, [dispatch]);

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

                {hasArticles ? <ArticlesScroller
                    handleArticleSelection={handleArticleSelection}
                /> : <NoSavedArticles key={'noSavedArticles'} />}
            </div>

        </motion.section>
    );
};


