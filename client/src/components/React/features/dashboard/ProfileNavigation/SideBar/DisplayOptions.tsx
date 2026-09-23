import DashboardOption from "./DashboardOption";
import BookmarkIcon from "@/components/React/global/IconComponents/BookmarkIcon";
import MetricsIcon from "@/components/React/global/IconComponents/MetricsIcon";
import InvestigationsIcon from "@/components/React/global/IconComponents/InvestigateIcon";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import React from "react";
import type { DashboardTab } from "@/state/Reducers/Dashboard/types";
import { changeTab } from "@/state/Reducers/Dashboard/DashboardSlice";
import { isArticlesTab, isInvestigationsTab } from "@/lib/helpers/lookup/isActiveTab";


function DisplayOptions() {
    const tab: DashboardTab = useSelector((s: RootState) => s.dash.tab);
    const dispatch = useDispatch<AppDispatch>();


    return (
        <ul
            id="dashboard-controls"
            className="space-y-2 font-medium">

            <DashboardOption tab={tab} name="Metrics" active={tab.kind === 'metrics'} onSelect={() => dispatch(changeTab({ kind: "metrics" }))}>
                <MetricsIcon active={tab.kind === 'metrics'} />
            </DashboardOption>

            <DashboardOption name="Investigations" active={isInvestigationsTab(tab)} tab={tab} onSelect={() => dispatch(changeTab({ kind: "investigations", display: "main" }))}>
                <InvestigationsIcon active={isInvestigationsTab(tab)} />
            </DashboardOption>

            <DashboardOption name="Articles" active={isArticlesTab(tab)} tab={tab} onSelect={() => dispatch(changeTab({ kind: "articles", display: "main" }))}>
                <BookmarkIcon active={isArticlesTab(tab)} />
            </DashboardOption>
        </ul>
    );
};

export default React.memo(DisplayOptions);