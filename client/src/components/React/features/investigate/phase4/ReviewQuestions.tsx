import { AnimatePresence } from "framer-motion";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import { ReviewStep } from "./containers/ReviewContainer";
import RenderReviewQuestions from "./containers/RenderReviewQuestions";

export default function ReviewQuestions({
  step,
  research,
}: {
  step: ReviewStep;
  research: Extract<
    UserResearchType,
    { phase: "reflection" } | { phase: "completed" }
  >;
}) {
  return (
    <div
      className="h-72 md:h-80 lg:h-88 py-6 opacity-100 z-1 xs:w-full 2xl:w-[36rem] 2xl:h-[32rem] xl:h-96 2xl:p-10 md:grow mx-auto flex flex-col
        2xl:min-h-96 
        flex-none gap-y-4 md:gap-y-7 bg-gradientdown rounded-3xl ring-1 ring-inset ring-white/5"
    >
      <header className="w-full h-auto">
        <h1 className="text-white text-lg lg:text-2xl 2xl:text-4xl w-full font-light tracking-tight text-center">
          Where you are now?
        </h1>
      </header>
      <main className="w-full h-full mx-auto flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <RenderReviewQuestions
            research={research}
            reviewStep={step}
            key={step.checkPoint}
          />
        </AnimatePresence>
      </main>
    </div>
  );
}
