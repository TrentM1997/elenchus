import { ExtractionProgressToastTypes } from "@/state/Reducers/Investigate/articles/ExtractedArticles";
import PendingExtractions from "../components/notification/PendingExtractions";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function RenderExtractProgressToast(state: {
  articles: ExtractionProgressToastTypes["articles"];
  progress: ExtractionProgressToastTypes["progress"];
}) {
  switch (state.articles.status) {
    case "initial":
    case "failed":
    case "pending":
    case "ready":
    case "error": {
      return null;
    }
    case "partial": {
      return (
        <PendingExtractions
          key={"pending-extractions-toast"}
          progress={state.progress}
        />
      );
    }

    default: {
      return assertNever(state.articles);
    }
  }
}
