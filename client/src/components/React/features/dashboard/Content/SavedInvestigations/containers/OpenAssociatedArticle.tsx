import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/state/store";
import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import { Suspense, lazy } from "react";
import DetailView from "../../../ProfileNavigation/mobile/DetailView";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
const Article = lazy(() => import('@/components/React/global/Articles/SuccessFull/containers/Article'));
import ArticleSkeleton from "@/components/React/global/Articles/skeletons/ArticleSkeleton";
import { grabAssociatedArticle } from "@/state/Reducers/UserContent/UserContentReducer";
import { chooseTab } from "@/state/Reducers/UserContent/DashboardTabs";

export default function OpenAssociatedArticle(): JSX.Element | null {
    const dispatch = useDispatch<AppDispatch>();
    const associatedArticle = useSelector((state: RootState) => state.userdata.associatedArticle);

    const backTo = () => {
        dispatch(grabAssociatedArticle(null));
        dispatch(chooseTab('Review Investigation'));
    }


    return (
        <motion.section
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.4, delay: 0.7 }}
            className="min-h-dvh h-full pb-[6.5rem] w-fit flex items-center justify-center z-30
                        mx-auto relative mt-16 xl:mt-6">
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


