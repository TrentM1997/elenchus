import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { bool } from 'prop-types'

export type PaginationStatus = 'active' | 'idle' | null;

export interface StepState {

    step: number,
    status: PaginationStatus,
    acceptInput: boolean | null
}


const initialState: StepState = {

    step: 0,
    status: null,
    acceptInput: null
}


export const StepSlice = createSlice({

    name: "StepsCounter",
    initialState: initialState,
    reducers: {
        increment: (state) => {

            state.step += 1
        },

        decrement: (state) => {

            state.step -= 1
        },
        incrementBy: (state, action: PayloadAction<number>) => {
            state.step = action.payload
        },
        backToStart: (state) => {
            state.step = 0
        },
        denyIncrement: (state, action) => {
            state.status = action.payload;
        },
        acceptedInput: (state, action) => {
            state.acceptInput = action.payload
        },
        updatePaginateStatus: (state: StepState, action: PayloadAction<PaginationStatus>) => {
            state.status = action.payload;
        }
    }

})


export const { increment, decrement, incrementBy, denyIncrement, acceptedInput, backToStart, updatePaginateStatus } = StepSlice.actions

export default StepSlice.reducer