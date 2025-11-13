import InvestigateHero from "@/components/React/features/investigate/phase1/wrappers/InvestigateHero"
import SearchHero from "@/components/React/features/investigate/heros/SearchHero"
import ReviewContainer from "@/components/React/features/investigate/phase4/containers/ReviewContainer"
import CompletionHero from "@/components/React/features/investigate/heros/CompletionHero"
import FinalResults from "@/components/React/features/investigate/phase5/FinalResults"
import ScrolltoTop from "@/helpers/ScrollToTop"
import { AnimatePresence, motion } from "framer-motion"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { softEase } from "@/motion/variants"
import { useIsMobile } from "@/hooks/useIsMobile"
import StoryPaginate from "../../phase3/buttons/StoryPaginate"
import { ReadingSliceState } from "@/ReduxToolKit/Reducers/Investigate/Reading"
import type { ModalDisplayed, Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering"

export default function HeroContainer({
}) {
    const isMobile = useIsMobile();
    const [shouldMeasure, setShouldMeasure] = useState<boolean>(false);
    const [spacerHeight, setSpacerHeight] = useState<number | null>(null);
    const phase: Phase = useSelector((s: RootState) => s.investigation.rendering.phase);
    const modal: ModalDisplayed = useSelector((s: RootState) => s.investigation.rendering.modal);
    const articles: ReadingSliceState = useSelector((state: RootState) => state.investigation.read.articles)
    const heightRef = useRef(null);
    const showSpacerDiv = useMemo(() => {
        const hasRetrievedArticles: boolean = ((Array.isArray(articles)) && (articles.length > 0));
        const show: boolean = hasRetrievedArticles && (phase === 'Phase 3');
        return show;
    }, [articles, phase]);



    useEffect(() => {
        if (shouldMeasure === false) return;

        const node = heightRef.current;
        const ro = new ResizeObserver(([e]) => {
            setSpacerHeight(Math.ceil(e.contentRect.height));
        });

        const t = requestAnimationFrame(() => {
            ro.observe(node)
            setShouldMeasure(false);
        });

        return () => {
            cancelAnimationFrame(t);
            ro.disconnect();
        };
    }, [shouldMeasure])




    return (
        <section className={`w-dvw h-full shrink-0 mx-auto transition-opacity duration-200 ease-in-out
        flex items-center
        ${(modal === 'Work Modal') ? 'opacity-50' : 'opacity-100'}
        `}
        >
            <AnimatePresence mode="wait">
                {(phase === 'Phase 1') && (<motion.div
                    key='Investigate'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        type: 'tween',
                        duration: 0.2
                    }}
                    className={`w-full h-fit mx-auto`}>
                    <InvestigateHero
                    />
                    <ScrolltoTop />

                </motion.div>)}

                {(phase === 'Phase 2') &&
                    (<motion.div
                        ref={heightRef}
                        key='Search'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { type: 'tween', duration: 0.2, delay: 0.5, ease: softEase } }}
                        exit={{ opacity: 0, transition: { type: 'tween', duration: 0.2, delay: 0, ease: softEase } }}
                        className={`w-full h-auto mx-auto relative`}
                        onAnimationComplete={() => {
                            setShouldMeasure(true)
                        }}
                    >
                        <SearchHero
                        />
                        <ScrolltoTop />

                    </motion.div>)}

                {showSpacerDiv && (phase === 'Phase 3') && <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'tween', duration: 0.3, delay: 0.2 }}
                    key="spacer-div"
                    style={{ height: spacerHeight, width: '100%' }}
                    className="flex items-center justify-center"
                >
                    {isMobile && <StoryPaginate />}
                </motion.div>
                }

                {(phase === 'Phase 4') && <motion.div
                    key='WrapUp'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { type: 'tween', delay: 0.2, duration: 0.3, ease: softEase } }}
                    exit={{ opacity: 0, transition: { type: 'tween', delay: 0, duration: 0.3, ease: softEase } }}
                    className={`w-full h-fit mx-auto`}
                >
                    <ReviewContainer />
                </motion.div>}

                {(phase === 'Phase 5') &&
                    <motion.div
                        key='Completion'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            type: 'tween',
                            duration: 0.24,
                            delay: 0.22,
                            ease: [0.4, 0, 0.2, 1],
                        }}
                        className={`w-full h-fit mx-auto`}
                    >
                        <CompletionHero />
                        <ScrolltoTop />
                    </motion.div>
                }

                {(phase === 'Phase 6') && <motion.div
                    key='Results'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full w-full max-w-full mx-auto"
                    transition={{
                        type: 'tween',
                        duration: 0.4,
                        delay: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                >
                    <FinalResults />
                    <ScrolltoTop />
                </motion.div>
                }
            </AnimatePresence>

        </section>
    );
};