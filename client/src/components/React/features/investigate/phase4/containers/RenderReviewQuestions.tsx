import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { ReviewStep } from "./ReviewContainer";
import Retrospect from "../Retrospect";
import IdeaMerit from "../IdeaMerit";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import Stance from "../Stance";

export default function RenderReviewQuestions({
  reviewStep,
  research,
}: {
  reviewStep: ReviewStep;
  research: Extract<
    UserResearchType,
    { phase: "reflection" } | { phase: "completed" }
  >;
}) {
  switch (reviewStep.checkPoint) {
    case "decide-takeaway": {
      return (
        <Stance
          research={research}
          key={`${reviewStep.checkPoint}/${research.phase}`}
        />
      );
    }
    case "idea-merit": {
      return (
        <IdeaMerit
          research={research}
          key={`${reviewStep.checkPoint}/${research.phase}`}
        />
      );
    }
    case "ending-perspective": {
      return <Retrospect key={`${reviewStep.checkPoint}/${research.phase}`} />;
    }

    default: {
      return assertNever(reviewStep);
    }
  }
}
