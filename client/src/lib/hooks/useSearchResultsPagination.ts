import {
  decrementPage,
  incrementPageBy,
  SearchResultsState,
} from "@/state/Reducers/Investigate/articles/SearchResults";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useCallback } from "react";

interface SearchResultsPaginationHook {
  handleNumberedClick: (index: number) => void;
  decrement: () => void;
  increment: () => void;
  currentPage: number;
  pages: SearchResultsState;
}

export const useSearchResultsPagination = (): SearchResultsPaginationHook => {
  const { pages, currentPage } = useSelector(
    (s: RootState) => s.investigation.search,
    shallowEqual,
  );
  const dispatch = useDispatch();

  const decrement = () => {
    if (currentPage > 0) {
      dispatch(decrementPage());
    } else if (currentPage > 0) {
      dispatch(decrementPage());
    }
  };

  const increment = () => {
    if (pages.status !== "ready") return;
    const value = (currentPage + 1) % pages.data.length;
    dispatch(incrementPageBy(value));
  };

  const handleNumberedClick = useCallback(
    (index: number) => {
      if (currentPage !== index) {
        dispatch(incrementPageBy(index));
      }
    },
    [currentPage],
  );

  return {
    decrement,
    increment,
    handleNumberedClick,
    pages,
    currentPage,
  };
};
