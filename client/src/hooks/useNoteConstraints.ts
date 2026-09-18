import {
  useLayoutEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/state/store";
import { getDragConstraints } from "@/state/Reducers/Investigate/NoteTaking";
import type { CanMeasureStatus } from "@/state/Reducers/Investigate/NoteTaking";

type NotePosition = {
  x: number;
  y: number;
};

type DragConstraints = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

type UseNoteConstraintsReturn = {
  notePosition: NotePosition;
  setNotePosition: React.Dispatch<React.SetStateAction<NotePosition>>;
  notesRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
};

export type { NotePosition, DragConstraints, UseNoteConstraintsReturn };

const useNoteConstraints = (): UseNoteConstraintsReturn => {
  const measureStatus: CanMeasureStatus = useSelector(
    (s: RootState) => s.investigation.notes.status,
  );
  const notesRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [notePosition, setNotePosition] = useState<NotePosition>({
    x: 20,
    y: 250,
  });
  const dispatch = useDispatch<AppDispatch>();

  const handleDragConstraints = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    dispatch(
      getDragConstraints({
        top: 0,
        left: 0,
        right: containerRect.width,
        bottom: containerRect.height,
      }),
    );
  }, [dispatch]);

  useLayoutEffect(() => {
    if (measureStatus === "idle") return;

    const frame = requestAnimationFrame(handleDragConstraints);

    return () => {
      cancelAnimationFrame(frame);
      setNotePosition({ x: 20, y: 300 });
    };
  }, [handleDragConstraints, measureStatus]);

  return {
    notePosition: notePosition,
    setNotePosition: setNotePosition,
    notesRef: notesRef,
    containerRef: containerRef,
  };
};

export { useNoteConstraints };
