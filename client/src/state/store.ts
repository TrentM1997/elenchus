import { configureStore } from "@reduxjs/toolkit";
import { InvestigateFeature } from "./Reducers/Root/InvestigateReducer";
import AuthenticateReducer from "./Reducers/Athentication/Authentication";
import FeedBackSlice from "./Reducers/Feedback/FeedbackSlice";
import BlueSkySlice from "./Reducers/BlueSky/BlueSkySlice";
import PipelineSlice from "./Reducers/RenderingPipelines/PipelineSlice";
import DashboardSlice from "./Reducers/Dashboard/DashboardSlice";
import { listenerMiddleware } from "./listenerMiddleware";

export const store = configureStore({
  reducer: {
    investigation: InvestigateFeature,
    auth: AuthenticateReducer,
    feedback: FeedBackSlice,
    bluesky: BlueSkySlice,
    overlay: PipelineSlice,
    dash: DashboardSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
