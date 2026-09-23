import type { JSX } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ExtractionRenderer from "@/components/React/features/investigate/phase3/containers/ExtractionRenderer";
import FailedExtractionsRenderer from "@/components/React/features/investigate/phase3/containers/FailedExtractionsRenderer";
import { RenderControlPanel } from "@/components/React/features/investigate/phase3/components/render/RenderControlPanel";
import ExtractionProgressWrapper from "@/components/React/features/investigate/phase3/containers/ExtractionProgressWrapper";

export default function ArticleContainer(): JSX.Element {
  const { articles, currentStory, progress } = useSelector(
    (state: RootState) => state.investigation.read,
    shallowEqual,
  );

  return (
    <div
      className="min-h-screen h-full w-full  scroll-smooth
      inset mx-auto border-white/10 relative"
    >
      <ExtractionProgressWrapper articles={articles} progress={progress} />
      <ExtractionRenderer state={articles} page={currentStory} />
      <FailedExtractionsRenderer state={articles} />
      <RenderControlPanel state={articles} />
    </div>
  );
}
