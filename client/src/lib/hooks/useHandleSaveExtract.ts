import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppSelector } from "@/state/hooks/useAppSelector";
import {
  selectWikiDisambig,
  selectWikiSummary,
} from "@/state/Reducers/Investigate/wiki/WikiSlice";
import { getExtract } from "@/state/Reducers/Investigate/pov/Review";
import { WikiDisambigResponse } from "../services/wiki/wiki";
import { wait } from "../helpers/formatting/Presentation";

type SavePayload =
  | {
      kind: "summary";
      title: string;
      extract: string;
      associatedArticle: string;
    }
  | {
      kind: "disambig";
      title: string;
      candidates: WikiDisambigResponse["candidates"];
      associatedArticle: string;
    };

type SaveExtractionStatus = "initial" | "saved" | "pending" | "failed";

export const useHandleSaveExtract = ({
  article_url,
}: {
  article_url: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<SaveExtractionStatus>("initial");
  const saveVersion = useRef(0);
  const summary = useAppSelector(selectWikiSummary);
  const disambig = useAppSelector(selectWikiDisambig);

  const payload: SavePayload | null = useMemo(() => {
    if (summary) {
      return {
        kind: "summary",
        title: summary.title,
        extract: summary.extract,
        associatedArticle: article_url,
      };
    }
    if (disambig) {
      return {
        kind: "disambig",
        title: disambig.title,
        candidates: disambig.candidates,
        associatedArticle: article_url,
      };
    }
    return null;
  }, [summary, disambig, article_url]);

  useEffect(() => {
    setStatus("initial");
    return () => {
      saveVersion.current += 1;
    };
  }, [payload]);

  const handleSaveExtract = useCallback(async () => {
    if (payload === null) return;
    const version = ++saveVersion.current;
    setStatus("pending");
    dispatch(getExtract(payload));
    await wait(500);
    if (version === saveVersion.current) setStatus("saved");
  }, [payload, dispatch]);

  return {
    handleSaveExtract,
    status,
    summary,
    disambig,
  };
};
