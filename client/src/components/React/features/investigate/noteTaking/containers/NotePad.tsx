import { motion } from "framer-motion";
import { TakingNoteState } from "@/state/Reducers/Investigate/articles/NoteTaking";
import NotesEditor from "@/components/React/global/TipTap/NotesEditor";
import type {
  DragConstraints,
  NotePosition,
} from "@/lib/hooks/rendering/useNoteConstraints";
import { NotesWrapperProps } from "../rendering/RenderNotePad";
import React from "react";
import CloseNotePadButton from "../components/CloseNotePadButton";
import NoteTabRail from "../components/NoteTabs";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import NotePadTopRail from "./NotePadRail";
import ActiveNote from "../components/ActiveNote";

interface Notes {
  notePosition: NotesWrapperProps["notePosition"];
  setNotePosition: NotesWrapperProps["setNotePosition"];
  constraints: DragConstraints;
  notesRef: React.RefObject<HTMLDivElement>;
  current: Extract<TakingNoteState, { status: "open" } | { status: "draft" }>;
}

export default function NotePad({
  notePosition,
  setNotePosition,
  constraints,
  notesRef,
  current,
}: Notes): React.JSX.Element {
  const writtenNotes = useSelector(
    (s: RootState) => s.investigation.notes.notesWritten,
  );

  return (
    <motion.div
      layout
      ref={notesRef}
      drag
      dragConstraints={constraints}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        setNotePosition((prev: NotePosition) => ({
          x: prev.x + info.delta.x,
          y: prev.y + info.delta.y,
        }));
      }}
      style={{ position: "absolute" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: notePosition.x, y: notePosition.y }}
      exit={{ scale: 0, opacity: 0 }}
      className="bg-mirage z-50 2xl:w-[29rem] 2xl:h-96 xs:h-60 xs:w-72
            shadow-thick rounded-lg inset cursor-pointer
            flex flex-col overflow-hidden"
    >
      <div className="h-full w-full box-border flex flex-col justify-start items-start">
        <NotePadTopRail
          writtenNotes={writtenNotes}
          activeNoteId={
            current.status === "draft" ? current.data.noteId : undefined
          }
        />
        <ActiveNote note={current} />
      </div>
    </motion.div>
  );
}
