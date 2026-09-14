import { HydrateDashboardService } from "@/lib/services/hydration/hydrateDashboardService";
import { createAsyncThunk } from "@reduxjs/toolkit";
const service = new HydrateDashboardService();

export const hydrateDashboard = createAsyncThunk(
  "DashboardSlice/hydrateDashboard",
  async (_, thunkAPI) => {
    try {
      return await service.hydrate();
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);
