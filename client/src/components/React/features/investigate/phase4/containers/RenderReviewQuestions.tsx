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
      return <Stance research={research} />;
    }
    case "idea-merit": {
      return <IdeaMerit research={research} />;
    }
    case "ending-perspective": {
      return <Retrospect />;
    }

    default: {
      return assertNever(reviewStep);
    }
  }
}
