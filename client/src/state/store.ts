import { configureStore } from "@reduxjs/toolkit";
import { InvestigateFeature } from "./Reducers/Root/InvestigateReducer";
import AuthenticateReducer from "./Reducers/Athentication/Authentication";
import UserContentSlice from "./Reducers/Dashboard/UserContent/UserContentReducer";
import userInvestigationSlice from "./Reducers/Dashboard/UserContent/UserInvestigations";
import ProfileNavigationSlice from "./Reducers/Dashboard/UserContent/ProfileNavigationSlice";
import SaveInvestigationSlice from "./Reducers/Dashboard/UserContent/SaveInvestigationSlice";
import FeedBackSlice from "./Reducers/Feedback/FeedbackSlice";
import BlueSkySlice from "./Reducers/BlueSky/BlueSkySlice";
import DashboardTabsSlice from "./Reducers/Dashboard/UserContent/DashboardTabs";
import PipelineSlice from "./Reducers/RenderingPipelines/PipelineSlice";
import DashboardSlice from "./Reducers/Dashboard/DashboardSlice";

export const store = configureStore({
  reducer: {
    investigation: InvestigateFeature,
    auth: AuthenticateReducer,
    userdata: UserContentSlice,
    userWork: userInvestigationSlice,
    profileNav: ProfileNavigationSlice,
    saveResearch: SaveInvestigationSlice,
    feedback: FeedBackSlice,
    bluesky: BlueSkySlice,
    dashboard: DashboardTabsSlice,
    overlay: PipelineSlice,
    dash: DashboardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
