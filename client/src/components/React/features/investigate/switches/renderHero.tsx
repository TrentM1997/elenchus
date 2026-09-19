import InvestigateHero from "@/components/React/features/investigate/phase1/wrappers/InvestigateHero";
import SearchHero from "@/components/React/features/investigate/heros/SearchHero";
import ReviewContainer from "@/components/React/features/investigate/phase4/containers/ReviewContainer";
import CompletionHero from "@/components/React/features/investigate/heros/CompletionHero";
import FinalResults from "@/components/React/features/investigate/phase5/FinalResults";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import { Phase } from "@/state/Reducers/Investigate/Rendering";
import HeroWrapper from "../shared/wrappers/HeroWrapper";
import RenderExtractedArticlesPagination from "../phase3/containers/RenderExtractedArticlesPagination";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function RenderHero({ phase }: { phase: Phase }) {
  const articlesState = useSelector(
    (s: RootState) => s.investigation.read.articles,
  );

  switch (phase) {
    case "Phase 1":
      return (
        <HeroWrapper key="gather-pov-hero">
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
      return <RenderExtractedArticlesPagination state={articlesState} />;
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
      );
    case "Phase 6":
      return (
        <HeroWrapper key="final-results-hero">
          <FinalResults />
          <ScrolltoTop />
        </HeroWrapper>
      );

    case "Initial":
      return null;

    default: {
      const exhaustive: never = phase;
      return null;
    }
  }
}
