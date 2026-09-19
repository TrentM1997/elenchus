import type { JSX } from "react";
import type { SearchResultsState } from "@/state/Reducers/Investigate/articles/SearchResults";
import ResultsSpacer from "../components/skeletons/ResultsSpacer";
import LinkPagination from "../components/buttons/LinkPagination";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function RenderSearchResultsPagination({
  state,
  disabled,
}: {
  state: SearchResultsState;
  disabled: boolean;
}): JSX.Element {
  switch (state.status) {
    case "initial":
    case "pending":
    case "failed":
    case "empty": {
      return <ResultsSpacer />;
    }
    case "ready": {
      return <LinkPagination disabled={disabled} />;
    }

    default: {
      return assertNever(state);
    }
  }
}
