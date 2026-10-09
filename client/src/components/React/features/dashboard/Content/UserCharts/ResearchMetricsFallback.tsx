import type { JSX } from "react";
import React from "react";
import NoSavedContentFallback from "../../fallbacks/NoSavedContentFallback";

export default function ResearchMetricsFallback(): JSX.Element {
  return (
    <React.Fragment>
      <NoSavedContentFallback />
    </React.Fragment>
  );
}
