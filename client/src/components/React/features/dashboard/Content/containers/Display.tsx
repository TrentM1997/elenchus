import Tabs from "./Tabs";
import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import ViewSavedContent from "./ViewSavedContent";
import { AnimatePresence } from "framer-motion";

function Display() {
    const { displayThisArticle, displayThisInvestigation } = useSelector(
        (s: RootState) => ({
            displayThisArticle: s.profileNav.displayThisArticle,
            displayThisInvestigation: s.profileNav.displayThisInvestigation,
        }),
        shallowEqual
    );
    const reviewingSavedContent: boolean = (displayThisArticle || displayThisInvestigation);


    return (
        <main
            className={`opacity-0  animate-fade-in animation-delay-300ms
            w-full relative h-full min-h-dvh px-4 
            md:px-6 lg:px-0 mx-auto flex items-start justify-center pb-16
        `}>

            <AnimatePresence mode="wait">
                {reviewingSavedContent &&
                    <ViewSavedContent key="saved-content" />
                }
                {!reviewingSavedContent && <Tabs key={'dashboard-tabs'} />}
            </AnimatePresence>
        </main>
    );
};


export default React.memo(Display);