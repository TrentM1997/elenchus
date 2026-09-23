import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import DashboardOption from "./DashboardOption";
import SignoutIcon from "@/components/React/global/IconComponents/SignoutIcon";
import SettingsIcon from "@/components/React/global/IconComponents/SettingsIcon";
import React from "react";
import { changeTab } from "@/state/Reducers/Dashboard/DashboardSlice";
import type { DashboardTab } from "@/state/Reducers/Dashboard/types";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";



function SessionOptions() {
    const tab: DashboardTab = useSelector((s: RootState) => s.dash.tab);
    const signingOut = useSelector((s: RootState) => s.overlay.modal === "Sign Out");
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

            <DashboardOption active={tab.kind === 'manage account'} name="Manage Account" tab={tab} onSelect={() => dispatch(changeTab({ kind: "manage account" }))}>
                <SettingsIcon />
            </DashboardOption>
        </ul>

    )
}

export default React.memo(SessionOptions);
