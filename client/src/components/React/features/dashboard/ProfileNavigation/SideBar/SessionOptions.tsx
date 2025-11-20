import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import DashboardOption from "./DashboardOption";
import SignoutIcon from "@/components/React/global/IconComponents/SignoutIcon";
import SettingsIcon from "@/components/React/global/IconComponents/SettingsIcon";
import React from "react";
import { chooseTab, type ActiveTab } from "@/ReduxToolKit/Reducers/UserContent/DashboardTabs";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { renderModal } from "@/ReduxToolKit/Reducers/RenderingPipelines/PipelineSlice";



function SessionOptions() {
    const tab: ActiveTab = useSelector((s: RootState) => s.dashboard.tab);
    const signingOut = useSelector((s: RootState) => s.auth.signOut);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <ul
            id="session-options"
            className="pt-4 mt-4 space-y-2 font-medium flex flex-col 
                            items-start border-t border-gray-200 dark:border-gray-700"
        >
            <DashboardOption active={signingOut} name="Sign Out" tab={tab} onSelect={() => dispatch(renderModal('Sign Out'))}>
                <SignoutIcon />
            </DashboardOption>

            <DashboardOption active={tab === 'Manage Account'} name="Manage Account" tab={tab} onSelect={() => dispatch(chooseTab('Manage Account'))}>
                <SettingsIcon />
            </DashboardOption>
        </ul>

    )
}

export default React.memo(SessionOptions);
