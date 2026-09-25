import { selectPOVData } from "@/state/Reducers/Investigate/pov/selectors";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/state/store";
import {
  PaginationStatus,
  updatePaginateStatus,
} from "@/state/Reducers/Investigate/pov/StepSlice";

export function useCheckFirstStep() {
  const dispatch = useDispatch<AppDispatch>();
  const { idea } = useSelector(selectPOVData);
  const timeRef = useRef<number | null>(null);
  const min: number = 4;

  const wordCount = (statement: string): number => {
    const trimmed: string[] = statement.trim().split(" ");
    return trimmed.length;
  };

  const check = useCallback((): void => {
    timeRef.current = window.setTimeout(() => {
      const count = wordCount(idea);
      const passes = count >= min;
      const removeStatusMessage: boolean = idea === "";
      const statusUpdate: PaginationStatus = passes ? "active" : "idle";
      if (!removeStatusMessage) {
        dispatch(updatePaginateStatus(statusUpdate));
      } else {
        dispatch(updatePaginateStatus(null));
      }
      timeRef.current = null;
    }, 300);
  }, [idea]);

  useEffect(() => {
    if (idea === null) return;

    check();

    return () => {
      if (timeRef.current !== null) {
        clearTimeout(timeRef.current);
      }
    };
  }, [idea]);
}
