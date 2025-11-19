import InvestigateHero from "@/components/React/features/investigate/phase1/wrappers/InvestigateHero"
import SearchHero from "@/components/React/features/investigate/heros/SearchHero"
import ReviewContainer from "@/components/React/features/investigate/phase4/containers/ReviewContainer"
import CompletionHero from "@/components/React/features/investigate/heros/CompletionHero"
import FinalResults from "@/components/React/features/investigate/phase5/FinalResults"
import ScrolltoTop from "@/helpers/ScrollToTop"
import ArticlePagination from "../phase3/containers/PaginationWrapper";
import { Phase } from "@/ReduxToolKit/Reducers/Investigate/Rendering"
import HeroWrapper from "../shared/wrappers/HeroWrapper"


const renderHero = (phase: Phase) => {

    switch (phase) {
        case "Phase 1":
            return (
                <HeroWrapper key="gather-pov-hero" >
                    <InvestigateHero />
                </HeroWrapper>
            );
        case "Phase 2":
            return (
                <HeroWrapper key="searchHero">
                    <SearchHero />
                    <ScrolltoTop />
                </HeroWrapper>
            );
        case "Phase 3":
            return (
                <ArticlePagination key={'article-pagination'} />
            );
        case "Phase 4":
            return (
                <HeroWrapper key="review-hero">
                    <ScrolltoTop />
                    <ReviewContainer />
                </HeroWrapper>
            );
        case "Phase 5":
            return (
                <HeroWrapper key="completion-animation">
                    <CompletionHero />
                    <ScrolltoTop />
                </HeroWrapper>
            )
        case "Phase 6":
            return (
                <HeroWrapper key="final-results-hero">
                    <FinalResults />
                    <ScrolltoTop />
                </HeroWrapper>
            );

        case "Initial":
            return null

        default: {
            const exhaustive: never = phase;
            return null;
        }
    };
};


export default renderHero