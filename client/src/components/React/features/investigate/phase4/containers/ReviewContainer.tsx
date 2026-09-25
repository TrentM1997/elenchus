import { useState } from "react";
import ReviewPagination from "../buttons/ReviewPagination";
import ReviewPOV from "../ReviewPOV";
import ReviewQuestions from "../ReviewQuestions";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";

export type ReviewStep =
  | { checkPoint: "decide-takeaway"; number: 3 }
  | { checkPoint: "idea-merit"; number: 1 }
  | { checkPoint: "ending-perspective"; number: 2 };

export default function ReviewContainer({
  research,
}: {
  research: Extract<
    UserResearchType,
    { phase: "reflection" } | { phase: "completed" }
  >;
}) {
  const [reviewStep, setReviewStep] = useState<ReviewStep>({
    checkPoint: "idea-merit",
    number: 1,
  });
  const [step, setStep] = useState<number>(1);

  return (
    <main className="w-full h-full flex flex-col pt-6 md:pt-16 lg:pt-0 lg:px-6 md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto 2xl:px-0 items-center gap-y-1.5 p-1 opacity-0 animate-fade-in animation-delay-600ms">
      <DelayedFallback>
        <ScrolltoTop />
        <article
          className="relative flex flex-col md:flex-row items-center 
                md:gap-x-2 2xl:gap-x-0.5 mx-auto w-full h-full p-2 rounded-4xl gap-y-0.5
                2xl:w-fit 2xl:h-full 2xl:max-w-7xl xl:max-w-6xl
              bg-ebony shadow-inset overflow-hidden lg:mt-16"
        >
          <div className="flex flex-col 2xl:px-1 h-full w-full">
            <ReviewPOV />
          </div>
          <div className="flex flex-col 2xl:px-1 h-full w-full">
            <ReviewQuestions step={reviewStep} research={research} />
          </div>
        </article>
        <footer className="w-full mx-auto">
          <div className="w-full h-auto mx-auto block">
            <ReviewPagination
              reviewStep={reviewStep}
              setReviewStep={setReviewStep}
            />
          </div>
        </footer>
      </DelayedFallback>
    </main>
  );
}
