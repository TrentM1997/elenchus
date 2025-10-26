import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/ReduxToolKit/store";
import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
import { Suspense, lazy } from "react";
import DetailView from "../../../ProfileNavigation/mobile/DetailView";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
const FullSavedArticle = lazy(() => import("../../UserArticles/components/fullContent/containers/FullSavedArticle"));
const Article = lazy(() => import('@/components/React/Shared/Articles/SuccessFull/containers/Article'));
import ArticleSkeleton from "@/components/React/Shared/Articles/skeletons/ArticleSkeleton";
import { presentThisInvestigation } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";
import { grabAssociatedArticle } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";

export default function OpenAssociatedArticle(): JSX.Element | null {
    const dispatch = useDispatch<AppDispatch>();
    const associatedArticle = useSelector((state: RootState) => state.userdata.associatedArticle);

    const backTo = () => {
        dispatch(grabAssociatedArticle(null));
        dispatch(presentThisInvestigation());
    }


    return (
        <motion.section
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.4, delay: 0.7 }}
            className="min-h-dvh h-dvh pb-32 w-fit flex items-center justify-center z-30
                        mx-auto relative mt-16 mt:pt-12 xl:mt-8">
            <DetailView backTo={backTo} />

            <main
                className="2xl:max-w-7xl xl:w-4/5 lg:max-w-4xl md:w-4/5 grow mx-auto
                sm:w-3/4  w-80 h-full overflow-y-auto no-scrollbar scroll-smooth scrollbar-gutter-stable-both overscroll-contain
                 xl:px-24
                 ">
                <ErrorBoundary>
                    {associatedArticle &&
                        <Suspense fallback={<DelayedFallback><ArticleSkeleton /></DelayedFallback>}>
                            <Article articleData={associatedArticle} investigating={false} />
                        </Suspense>
                    }
                </ErrorBoundary>

            </main>
        </motion.section>
    )
}


