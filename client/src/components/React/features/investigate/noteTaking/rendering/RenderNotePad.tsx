import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";
import type {
  DragConstraints,
  NotePosition,
} from "@/lib/hooks/rendering/useNoteConstraints";
import React, { SetStateAction } from "react";
import Notes from "../containers/NotePad";
import { TakingNoteState } from "@/state/Reducers/Investigate/articles/NoteTaking";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export interface NotesWrapperProps {
  notePosition: NotePosition;
  setNotePosition: React.Dispatch<SetStateAction<NotePosition>>;
  notesRef: React.RefObject<HTMLDivElement>;
  constraints: DragConstraints;
}

export function RenderNotePad({
  state,
  notePosition,
  notesRef,
  constraints,
  setNotePosition,
}: {
  state: TakingNoteState;
} & NotesWrapperProps) {
  switch (state.status) {
    case "closed": {
      return null;
    }
    case "open":
    case "draft":
      return (
        <AnimatePresence>
          <Notes
            key={"notepad"}
            notesRef={notesRef}
            constraints={constraints}
            notePosition={notePosition}
            setNotePosition={setNotePosition}
            current={state}
          />
        </AnimatePresence>
      );

    default: {
      return assertNever(state);
    }
  }
}
