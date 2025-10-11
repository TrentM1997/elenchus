import { AppDispatch, RootState } from "@/ReduxToolKit/store"
import { lazy, Suspense, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
const FullSavedArticle = lazy(() => import('../components/fullContent/containers/FullSavedArticle'));
const Article = lazy(() => import('../../../../../Shared/Articles/SuccessFull/containers/Article'))
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary"
import ArticleSkeleton from "@/components/React/Shared/Articles/skeletons/ArticleSkeleton";
import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import DetailView from "../../../ProfileNavigation/mobile/DetailView"
import { presentArticles } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";

export default function ArticleReview() {
    const savedArticle = useSelector((state: RootState) => state.userdata.ArticleToReview);
    if (!savedArticle) return null;

    const showArticle = useMemo(() => {
        const shouldShow: boolean = (savedArticle !== null);
        return shouldShow;
    }, [savedArticle]);

    const dispatch = useDispatch<AppDispatch>();

    const backTo = () => {
        dispatch(presentArticles());
    };


    return (

        <motion.section
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.4, delay: 0.7 }}
            className="min-h-dvh h-dvh pb-32 w-full flex items-center justify-center overflow-hidden
                        mx-auto relative mt-16 mt:pt-12 xl:mt-8">
            <DetailView backTo={backTo} />

            <main
                className="2xl:max-w-7xl xl:w-4/5 lg:max-w-4xl md:w-4/5 grow
                sm:w-3/4  w-80 h-full overflow-y-auto no-scrollbar scroll-smooth scrollbar-gutter-stable-both overscroll-contain
                 xl:px-24
                 ">
                <ErrorBoundary>
                    {showArticle &&
                        <Suspense fallback={<DelayedFallback><ArticleSkeleton /></DelayedFallback>}>
                            <FullSavedArticle article={savedArticle} />
                        </Suspense>
                    }
                </ErrorBoundary>

            </main>
        </motion.section>
    )
}