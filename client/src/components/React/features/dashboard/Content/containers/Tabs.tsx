import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import Metrics from "./Metrics";
const SavedArticles = lazy(() => import('../UserArticles/containers/SavedArticles'));
const SavedResearchLayout = lazy(() => import('../SavedInvestigations/containers/SavedResearchLayout'));
import AccManagement from "../../ProfileNavigation/AccountManagement/AccManagement";
import DisplayLoader from "@/components/React/Shared/Loaders/DisplayLoader";
import AppWindowIcon from "@/components/React/Shared/IconComponents/AppWindowIcon";
import { variants } from "@/motion/variants";
import React from "react";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";


function Tabs(): JSX.Element | null {
    const {
        displaySavedInvestigations,
        displaySavedArticles,
        displayAccountManagement,
        displayMetrics,
        displayThisArticle,
        displayThisInvestigation
    } = useSelector((state: RootState) => state.profileNav, shallowEqual);

    const savedContentRendered: boolean = (displayThisArticle || displayThisInvestigation);


    return (
        <motion.div
            style={savedContentRendered ? { opacity: 0, pointerEvents: 'none', zIndex: -1 } : null}
            className="absolute inset-0"
            variants={variants} initial='closed' animate='open' exit='closed' transition={{ type: 'tween', duration: 0.2 }}>
            <ErrorBoundary>
                <AnimatePresence mode="wait">
                    {displayMetrics && <Metrics key='dashboard' />}

                    {displayAccountManagement && <AccManagement key='settings' />}

                    {displaySavedArticles &&
                        <Suspense fallback={<DelayedFallback><DisplayLoader><AppWindowIcon /></DisplayLoader></DelayedFallback>}>
                            <SavedArticles key='articles' />
                        </Suspense>
                    }
                    {displaySavedInvestigations &&
                        <Suspense
                            fallback={
                                <DelayedFallback>
                                    <DisplayLoader>
                                        <AppWindowIcon />
                                    </DisplayLoader>
                                </DelayedFallback>
                            }
                        >
                            <SavedResearchLayout
                                key='investigations'
                            />
                        </Suspense>
                    }

                </AnimatePresence>
            </ErrorBoundary>

        </motion.div>

    )
};


export default React.memo(Tabs);