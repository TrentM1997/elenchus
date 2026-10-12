import { selectPOVData } from "@/state/Reducers/Investigate/pov/selectors";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/state/store";
import { updatePaginateStatus } from "@/state/Reducers/Investigate/pov/StepSlice";

export function useCheckFirstStep() {
  const dispatch = useDispatch<AppDispatch>();
  const { idea } = useSelector(selectPOVData);
  const timeRef = useRef<number | null>(null);
  const min: number = 4;

  const wordCount = (statement: string): number => {
    return statement === "" ? 0 : statement.split(/\s+/).length;
  };

  const guardFirstStep = (value: string) => {
    const trimmed = value.trim();
    const count = wordCount(trimmed);
    const passes = count >= min;
    if (passes) {
      return "active";
    } else {
      return "idle";
    }
  };

  const status = guardFirstStep(idea);

  const check = useCallback((): void => {
    timeRef.current = window.setTimeout(() => {
      if (idea === "") {
        dispatch(updatePaginateStatus("idle"));
        timeRef.current = null;
        return;
      }
      dispatch(updatePaginateStatus(status));

      timeRef.current = null;
    }, 300);
  }, [idea, status, dispatch]);

  useEffect(() => {
    check();

    return () => {
      if (timeRef.current !== null) {
        clearTimeout(timeRef.current);
      }
    };
  }, [check]);
}
