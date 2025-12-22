import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { useEffect, useRef } from "react";
import { RetrieveArticles, resetArticles } from "@/state/Reducers/Investigate/SearchResults";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import SearchBar from "../components/input/SearchBar";
import { clearChosenArticles } from "@/state/Reducers/Investigate/ChosenArticles";
import { normalize } from "@/helpers/Normailize";
import React from "react";

export default function Search({ }): JSX.Element | null {
  const dispatch = useDispatch<AppDispatch>();
  const lastCommitedInput = useRef<string | null>(null);
  const draftRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const inFlightRef = useRef<{ abort: () => void } | null>(null);

  const recordQuery = (raw: string): boolean => {
    const q = normalize(raw);
    if (q.length <= 2) return;

    if (q !== lastCommitedInput.current) {
      draftRef.current = q;
      return true;
    } else {
      return false;
    }
  };


  const getSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);

    const val: string | null = e.currentTarget.value;

    timerRef.current = window.setTimeout(() => {
      recordQuery(val);
      timerRef.current = null;
    }, 300);
  };



  const flush = (val: string) => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    };
    recordQuery(val);
  };

  const send = () => {
    inFlightRef.current?.abort();
    inFlightRef.current = new AbortController();
    const q = draftRef.current;
    if (!q) return;
    dispatch(clearChosenArticles());
    dispatch(resetArticles());
    const thunkPromise = dispatch(RetrieveArticles({ query: q, timeout: 5000 }));
    inFlightRef.current = thunkPromise as unknown as { abort: () => void }
    lastCommitedInput.current = q;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const form = e.currentTarget,
      input = form.elements.namedItem('q') as HTMLInputElement | null,
      raw = input
        ? input.value
        : null;

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    if (recordQuery(raw)) send();
  };


  useEffect(() => {

    return () => {
      if (inFlightRef.current !== null) {
        inFlightRef.current.abort();
      }
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      };
    }
  }, []);


  return (
    <div
      className="opacity-0 animate-fade-skew animation-delay-300ms transition-opacity relative
      ease-soft min-w-full max-w-full mx-auto md:px-2 2xl:h-full no-scrollbar">
      <div
        className="text-center w-full md:mx-auto">
        <div
          className="inline-flex flex-wrap items-center w-full">
          <div
            className="w-full">
            <ErrorBoundary
            >
              <div
                className="relative lg:mb-2 mx-auto flex justify-center items-center">

                <SearchBar
                  getSearchInput={getSearchInput}
                  handleSubmit={handleSubmit}
                  flush={flush}
                />
              </div>
            </ErrorBoundary>

          </div>
        </div>
      </div>
    </div>
  )
};