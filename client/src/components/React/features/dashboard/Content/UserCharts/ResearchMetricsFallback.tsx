import type { JSX } from "react";
import React from "react";
import NoSavedArticles from "../UserArticles/fallbacks/NoSavedArticles";
import NoSavedContentFallback from "../../fallbacks/NoSavedContentFallback";
import StatsFallback from "../../../charts/ChartFallbacks/StatsFallback";

export default function ResearchMetricsFallback(): JSX.Element {
  return (
    <React.Fragment>
      <NoSavedArticles />
      <NoSavedContentFallback />
      <StatsFallback />
    </React.Fragment>
  );
}
