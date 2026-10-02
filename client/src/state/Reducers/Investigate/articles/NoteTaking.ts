import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DragConstraints } from "@/lib/hooks/rendering/useNoteConstraints";
import type { JSONContent } from "@tiptap/core";

export type CanMeasureStatus = "idle" | "available";

export type WrittenNote = { noteId: string; content: JSONContent };

export type TakingNoteState =
  | { status: "closed" }
  | { status: "open" }
  | { status: "draft"; data: WrittenNote };

export type NotesWritten =
  | { status: "none" }
  | { status: "populated"; data: WrittenNote[] };

interface NoteState {
  current: TakingNoteState;
  constraints: DragConstraints;
  status: CanMeasureStatus;
  notesWritten: NotesWritten;
}

const initialState: NoteState = {
  current: { status: "closed" },
  notesWritten: { status: "none" },
  constraints: { top: 0, left: 0, right: 0, bottom: 0 },
  status: "idle",
};

export const NoteSlice = createSlice({
  name: "takeNotes",
  initialState: initialState,
  reducers: {
    openOrCloseNotePad: (
      state: NoteState,
      action: PayloadAction<
        Extract<TakingNoteState, { status: "closed" } | { status: "open" }>
      >,
    ) => {
      state.current = action.payload;
    },
    draftNote: (
      state: NoteState,
      action: PayloadAction<Extract<TakingNoteState, { status: "draft" }>>,
    ) => {
      state.current = action.payload;
      const note = action.payload.data;
      const writtenStatus = state.notesWritten.status;

      switch (writtenStatus) {
        case "none": {
          state.notesWritten = { status: "populated", data: [note] };
          return;
        }
        case "populated": {
          const existingNote = state.notesWritten.data.find(
            ({ noteId }) => noteId === note.noteId,
          );
          if (existingNote) {
            existingNote.content = note.content;
            return;
          }
          state.notesWritten.data.unshift(note);
          return;
        }
      }
    },
    openWrittenNote: (state: NoteState, action: PayloadAction<WrittenNote>) => {
      state.current = { status: "draft", data: action.payload };
    },
    getDragConstraints: (
      state: NoteState,
      action: PayloadAction<DragConstraints>,
    ) => {
      state.constraints = action.payload;
    },
    setCanMeasureStatus: (
      state: NoteState,
      action: PayloadAction<CanMeasureStatus>,
    ) => {
      state.status = action.payload;
    },
  },
});

export type NoteReducer = ReturnType<typeof NoteSlice.reducer>;

export const {
  draftNote,
  getDragConstraints,
  setCanMeasureStatus,
  openOrCloseNotePad,
  openWrittenNote,
} = NoteSlice.actions;

export default NoteSlice.reducer;
