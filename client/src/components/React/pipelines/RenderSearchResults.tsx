import type { JSX } from "react";
import type { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { SearchResultsState } from "@/state/Reducers/Investigate/articles/SearchResults";
import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import { BrowsingOptionSchemaType } from "@/lib/schemas/articles/BrowsingOptionSchema";
import ResultsPending from "../features/investigate/phase2/results/pending/ResultsPending";
import NoSearchResults from "../features/investigate/phase2/results/errors/SearchFailed";
import Page from "../features/investigate/phase2/results/containers/Page";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import FailedState from "../global/fallbacks/FailedState";

type RenderSearchResultsProps = {
  state: SearchResultsState;
  urlHash: Set<string>;
  select: (article: BrowsingOptionSchemaType) => () => void;
  selected: SelectedArticles;
};

export default function RenderSearchResults({
  state,
  urlHash,
  select,
  selected,
}: RenderSearchResultsProps): JSX.Element | null {
  const currentPage = useSelector(
    (s: RootState) => s.investigation.search.currentPage,
  );

  switch (state.status) {
    case "initial": {
      return null;
    }
    case "pending": {
      return <ResultsPending key={"loading-search-results"} />;
    }
    case "failed": {
      return <FailedState key={"news-search-failed"} />;
    }
    case "empty": {
      return <NoSearchResults key="no-results" />;
    }
    case "ready": {
      const page = state.data[currentPage];

      return (
        <Page
          select={select}
          selected={selected}
          page={page}
          urlHash={urlHash}
        />
      );
    }

    default: {
      return assertNever(state);
    }
  }
}
