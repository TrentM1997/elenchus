import { motion, AnimatePresence } from "framer-motion";
import SearchResults from "@/components/React/features/investigate/phase2/results/containers/SearchResults";
import ModalContainer from "@/components/React/features/investigate/shared/wrappers/ModalContainer";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import ScrolltoTop from "@/helpers/ScrollToTop";
import ArticleContainer from "@/components/React/Shared/Articles/containers/ArticleContainer";
import { useMemo } from "react";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";

export default function Content() {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { wikiModalStages } = investigateState.wiki;
    const {
        search,
        display
    } = investigateState;
    const {
        showContent,
        showBackToSearchModal,
        showSearch,
        showGetArticlesModal,
        showSelectWarning,
        showSelectTooltip,
        showReadingTooltip
    } = display;
    const {
        status
    } = search;

    const animateSearch = useMemo((): boolean => {

        const firstCondition: boolean = ((showSearch) && (status !== 'idle'));
        const secondCondition: boolean = (!showContent);
        const show: boolean = firstCondition && secondCondition;
        return show;

    }, [showSearch, status]);

    const animateArticles = useMemo(() => {
        const show: boolean = (showContent) && (!animateSearch);
        return show;
    }, [animateSearch, showContent]);


    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className={`${showBackToSearchModal || showGetArticlesModal || showSelectWarning || showSelectTooltip ? 'pointer-events-none' : 'pointer-events-auto'}
            ${wikiModalStages.highlight && 'cursor-text'}
                relative shrink-0 w-full h-full min-h-screen mx-auto xs:px-2`}>

            <ModalContainer />

            <div
                className="relative 2xl:max-w-7xl w-full min-h-full flex flex-col justify-center box-border mx-auto">
                <AnimatePresence mode="wait">

                    {animateSearch &&
                        <motion.div
                            key='links'
                            style={{ position: 'relative' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { type: 'tween', duration: 0.25, delay: 0.5 } }}
                            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.25, delay: 0 } }}
                            transition={{ type: 'tween', duration: 0.5 }}
                            className="w-full min-h-screen lg:pb-96"
                        >
                            <SearchResults />

                        </motion.div>}

                    {animateArticles &&
                        <motion.div
                            key='articles'
                            style={{ position: 'relative' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showReadingTooltip ? 0.5 : 1, transition: { type: 'tween', duration: 0.2, delay: 0.3 } }}
                            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.2, delay: 0 } }}
                            className="min-h-screen 2xl:max-w-5xl xl:max-w-4xl mx-auto lg:pb-96"
                        >
                            <ArticleContainer />
                            <ScrolltoTop key='scroll' />
                        </motion.div>}
                </AnimatePresence>
            </div>
        </motion.div>

    )
}
