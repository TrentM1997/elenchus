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
    case "error": {
      return null;
    }
    case "pending":
    case "partial":
    case "ready": {
      return <PendingExtractions progress={state.progress} />;
    }

    default: {
      return assertNever(state.articles);
    }
  }
}
