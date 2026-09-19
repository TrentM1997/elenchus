import FailedLoading from "@/components/React/global/Articles/Failed/FailedLoading";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { ArticleExtractionState } from "@/state/Reducers/Investigate/articles/types";

export default function FailedExtractionsRenderer({
  state,
}: {
  state: ArticleExtractionState;
}) {
  switch (state.status) {
    case "ready":
    case "partial":
    case "failed":
    case "error":
      return <FailedLoading failed={state.data.failed} />;
    case "initial":
    case "pending":
      return null;
    default:
      return assertNever(state);
  }
}
