import { normalize } from "@/lib/helpers/formatting/Normailize";
import { getBlueSkyPosts } from "@/state/Reducers/BlueSky/BlueSkySlice";
import { searchBlueSky } from "@/state/Reducers/BlueSky/thunks";
import { AppDispatch, RootState } from "@/state/store";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useSearchBlueSky = () => {
  const status = useSelector((state: RootState) => state.bluesky.posts.status);
  const dispatch = useDispatch<AppDispatch>();
  const inFlightRef = useRef<{ abort: () => void } | null>(null);
  const timerRef = useRef<number | null>(null);
  const draftRef = useRef<string | null>(null);
  const lastQuery = useRef<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const composing = (e.nativeEvent as KeyboardEvent).isComposing;
    if (composing) return;
    if (e.key === "Enter") {
      e.preventDefault();
      flush(e.currentTarget.value);
    }
  };

  const flush = (val: string) => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    recordQuery(val);
  };

  const recordQuery = (raw: string | null): boolean => {
    if (!raw) return false;

    const query = normalize(raw);
    if (query.length <= 2) return false;

    const isDuplicate = query === lastQuery.current;

    if (isDuplicate && status !== "failed") {
      return false;
    }

    draftRef.current = query;
    return true;
  };

  const getSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);

    const val: string | null = e.currentTarget.value;

    timerRef.current = window.setTimeout(() => {
      recordQuery(val);
      timerRef.current = null;
    }, 300);
  };

  const send = () => {
    inFlightRef.current?.abort();
    inFlightRef.current = new AbortController();
    const q = draftRef.current;
    if (!q) return;
    dispatch(getBlueSkyPosts({ status: "initial" }));

    const thunkPromise = dispatch(searchBlueSky(q));
    inFlightRef.current = thunkPromise as unknown as { abort: () => void };
    lastQuery.current = q;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const form = e.currentTarget,
      input = form.elements.namedItem("q") as HTMLInputElement | null,
      raw = input ? input.value : null;

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (recordQuery(raw)) send();
  };

  return {
    handleKeyDown,
    handleSubmit,
    getSearchInput,
    status,
  };
};
