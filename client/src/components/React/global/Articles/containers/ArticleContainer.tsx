import type { JSX } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ExtractionRenderer from "@/components/React/features/investigate/phase3/containers/ExtractionRenderer";
import FailedExtractionsRenderer from "@/components/React/features/investigate/phase3/containers/FailedExtractionsRenderer";

export default function ArticleContainer(): JSX.Element {
  const { articles, currentStory } = useSelector(
    (state: RootState) => state.investigation.read,
    shallowEqual,
  );

  return (
    <div
      className="min-h-screen h-full w-full scroll-smooth
      inset mx-auto border-white/10 relative"
    >
      <ExtractionRenderer state={articles} page={currentStory} />
      <FailedExtractionsRenderer state={articles} />
    </div>
  );
}
