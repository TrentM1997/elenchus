import { configureStore } from '@reduxjs/toolkit'
import { InvestigateFeature } from './Reducers/Root/InvestigateReducer'
import AuthenticateReducer from './Reducers/Athentication/Authentication'
import UserContentSlice from './Reducers/UserContent/UserContentReducer'
import userInvestigationSlice from './Reducers/UserContent/UserInvestigations'
import ProfileNavigationSlice from './Reducers/UserContent/ProfileNavigationSlice'
import SaveInvestigationSlice from './Reducers/UserContent/SaveInvestigationSlice'
import FeedBackSlice from './Reducers/Feedback/FeedbackSlice'
import BlueSkySlice from './Reducers/BlueSky/BlueSkySlice'
import ChartSlice from './Reducers/UserContent/ChartSlice';
import DashboardTabsSlice from './Reducers/UserContent/DashboardTabs';
import PipelineSlice from './Reducers/RenderingPipelines/PipelineSlice';


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
        chart: ChartSlice,
        dashboard: DashboardTabsSlice,
        overlay: PipelineSlice
    }

});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;