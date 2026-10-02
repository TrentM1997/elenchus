import { WikipediaToolState } from "@/state/Reducers/Investigate/wiki/types";
import {
  clearWikiSlice,
  wikiToolAction,
} from "@/state/Reducers/Investigate/wiki/WikiSlice";
import { AppDispatch, RootState } from "@/state/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type HighlightTermHook = {
  handleHighlightEnd: () => void;
  toolState: WikipediaToolState;
};

export const useHighlightTerm = (): HighlightTermHook => {
  const toolState = useSelector(
    (s: RootState) => s.investigation.wiki.extractTool,
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleText = (selection: Selection | null) => {
    if (selection && selection.rangeCount > 0) {
      const selectedTextString = selection.toString().trim();
      if (selectedTextString.length > 2) {
        dispatch(
          wikiToolAction({ status: "confirm", data: selectedTextString }),
        );
      }
    }
  };

  const handleHighlightEnd = () => {
    if (toolState.status === "highlight") {
      const selection = window.getSelection();
      handleText(selection);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearWikiSlice());
    };
  }, []);

  return {
    handleHighlightEnd,
    toolState,
  };
};
