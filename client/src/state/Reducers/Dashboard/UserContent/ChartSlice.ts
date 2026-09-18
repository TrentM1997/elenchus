import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Chart {

    biasRatings: number[],
    reportingIntegrity: number[]
};

const initialState: Chart = {
    biasRatings: [],
    reportingIntegrity: []
};


export const ChartSlice = createSlice({
    name: 'chartData',
    initialState: initialState,
    reducers: {

        getReportingRatings: (state: Chart, action: PayloadAction<number[]>) => {
            state.reportingIntegrity = action.payload;
        },
        getBiasSnapshot: (state: Chart, action: PayloadAction<number[]>) => {
            state.biasRatings = action.payload;
        },
        clearCharts: (state: Chart) => state = initialState
    }
});


export const { getReportingRatings, getBiasSnapshot, clearCharts } = ChartSlice.actions;

export default ChartSlice.reducer;