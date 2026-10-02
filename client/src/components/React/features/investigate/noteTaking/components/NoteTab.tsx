import { WrittenNote } from "@/state/Reducers/Investigate/articles/NoteTaking";

interface NoteTab {
  index: number;
  note: WrittenNote;
  handleClick: (note: WrittenNote) => void;
  activeNoteId?: string;
}

export default function NoteTab({
  note,
  index,
  handleClick,
  activeNoteId,
}: NoteTab) {
  const isActiveNote =
    activeNoteId !== undefined && note.noteId === activeNoteId;

  return (
    <div
      className={`${isActiveNote ? "bg-white/10" : "bg-mirage hover:bg-white/10"}
        text-white font-light tracking-tight rounded-sm p-1 shadow-thick transition-all ease-soft
        
        `}
      key={note.noteId}
      onClick={() => handleClick(note)}
    >
      Note {index + 1}
    </div>
  );
}
