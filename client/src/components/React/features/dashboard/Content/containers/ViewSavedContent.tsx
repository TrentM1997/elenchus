import ArticleReview from "../UserArticles/containers/ArticleReview";
import ResearchReview from "../SavedInvestigations/containers/ResearchReview";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import OpenAssociatedArticle from "../SavedInvestigations/containers/OpenAssociatedArticle";


function ViewSavedContent(): JSX.Element | null {
    const { displayThisArticle, displayThisInvestigation, readAssociatedArticle } = useSelector(
        (s: RootState) => ({
            displayThisArticle: s.profileNav.displayThisArticle,
            displayThisInvestigation: s.profileNav.displayThisInvestigation,
            readAssociatedArticle: s.profileNav.readAssociatedArticle
        }),
        shallowEqual
    );

    return (
        <motion.section
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.2 }}
            className="w-auto h-auto absolute inset-0">
            {readAssociatedArticle && <OpenAssociatedArticle />}
            {displayThisArticle && <ArticleReview />}
            {displayThisInvestigation && <ResearchReview />}
        </motion.section>
    )
};


export default React.memo(ViewSavedContent);