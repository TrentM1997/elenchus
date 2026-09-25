import InvestigateHero from "@/components/React/features/investigate/phase1/wrappers/InvestigateHero";
import SearchHero from "@/components/React/features/investigate/heros/SearchHero";
import ReviewContainer from "@/components/React/features/investigate/phase4/containers/ReviewContainer";
import CompletionHero from "@/components/React/features/investigate/heros/CompletionHero";
import FinalResults from "@/components/React/features/investigate/phase5/FinalResults";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import HeroWrapper from "../shared/wrappers/HeroWrapper";
import RenderExtractedArticlesPagination from "../phase3/containers/RenderExtractedArticlesPagination";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function RenderHero({ state }: { state: UserResearchType }) {
  const articlesState = useSelector(
    (s: RootState) => s.investigation.read.articles,
  );

  switch (state.phase) {
    case "framing":
      return (
        <HeroWrapper key="gather-pov-hero">
          <ScrolltoTop />
          <InvestigateHero />
        </HeroWrapper>
      );
    case "searching":
      return (
        <HeroWrapper key="searchHero">
          <SearchHero />
          <ScrolltoTop />
        </HeroWrapper>
      );
    case "evidence":
      return <RenderExtractedArticlesPagination state={articlesState} />;
    case "reflection":
      return (
        <HeroWrapper key="review-hero">
          <ScrolltoTop />
          <ReviewContainer research={state} />
        </HeroWrapper>
      );

    case "completed": {
      return (
        <HeroWrapper key={"completion-hero"}>
          <ScrolltoTop />
          <CompletionHero />
        </HeroWrapper>
      );
    }

    case "end":
      return (
        <HeroWrapper key="final-results-hero">
          <FinalResults idea={state.data.framing.idea} />
          <ScrolltoTop />
        </HeroWrapper>
      );

    case "initial":
      return null;

    default: {
      return assertNever(state);
    }
  }
}
