import { SearchResultsState } from "@/state/Reducers/Investigate/articles/SearchResults";
import React from "react";
import PageButton from "./PageButton";

export default function RenderPaginationNumberedButtons({
  pages,
  currentPage,
  handleNumberedClick,
}: {
  pages: Extract<SearchResultsState, { status: "ready" }>["data"];
  currentPage: number;
  handleNumberedClick: (index: number) => void;
}) {
  return (
    <React.Fragment>
      {pages.map((_, index: number) => (
        <PageButton
          key={`button ${index + 1}`}
          currentPage={currentPage}
          index={index}
          handleNumberedClick={handleNumberedClick}
        />
      ))}
    </React.Fragment>
  );
}
