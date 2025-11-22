import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { DragConstraints } from '@/hooks/useNoteConstraints'

export type CanMeasureStatus = 'idle' | 'available';

interface NoteState {
    takingNotes: boolean,
    noteTaken: string | null,
    constraints: DragConstraints | null,
    status: CanMeasureStatus
};

const initialState: NoteState = {
    takingNotes: false,
    noteTaken: '',
    constraints: null,
    status: 'idle'
};

export const NoteSlice = createSlice({
    name: 'takeNotes',
    initialState: initialState,
    reducers: {
        writingNote: (state: NoteState) => {
            state.takingNotes = !state.takingNotes;
        },
        saveNote: (state: NoteState, action: PayloadAction<string | null>) => {
            state.noteTaken = action.payload
        },
        getDragConstraints: (state: NoteState, action: PayloadAction<DragConstraints | null>) => {
            state.constraints = action.payload;
        },
        setCanMeasureStatus: (state: NoteState, action: PayloadAction<CanMeasureStatus>) => {
            state.status = action.payload;
        }
    }
});

export type NoteReducer = ReturnType<typeof NoteSlice.reducer>;

export const { writingNote, saveNote, getDragConstraints, setCanMeasureStatus } = NoteSlice.actions

export default NoteSlice.reducer;