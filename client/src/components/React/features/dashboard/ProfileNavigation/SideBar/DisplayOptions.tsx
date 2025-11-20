import DashboardOption from "./DashboardOption";
import BookmarkIcon from "@/components/React/global/IconComponents/BookmarkIcon";
import MetricsIcon from "@/components/React/global/IconComponents/MetricsIcon";
import InvestigationsIcon from "@/components/React/global/IconComponents/InvestigateIcon";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/ReduxToolKit/store";
import React from "react";
import type { ActiveTab } from "@/ReduxToolKit/Reducers/UserContent/DashboardTabs";
import { chooseTab } from "@/ReduxToolKit/Reducers/UserContent/DashboardTabs";
import { isArticlesTab, isInvestigationsTab } from "@/helpers/lookup/isActiveTab";


function DisplayOptions() {
    const tab: ActiveTab = useSelector((s: RootState) => s.dashboard.tab);
    const dispatch = useDispatch<AppDispatch>();


    return (
        <ul
            id="dashboard-controls"
            className="space-y-2 font-medium">

            <DashboardOption tab={tab} name="Metrics" active={tab === 'Metrics'} onSelect={() => dispatch(chooseTab('Metrics'))}>
                <MetricsIcon active={tab === 'Metrics'} />
            </DashboardOption>

            <DashboardOption name="Investigations" active={isInvestigationsTab(tab)} tab={tab} onSelect={() => dispatch(chooseTab('Investigations'))}>
                <InvestigationsIcon active={isInvestigationsTab(tab)} />
            </DashboardOption>

            <DashboardOption name="Articles" active={isArticlesTab(tab)} tab={tab} onSelect={() => dispatch(chooseTab('Articles'))}>
                <BookmarkIcon active={isArticlesTab(tab)} />
            </DashboardOption>
        </ul>
    );
};

export default React.memo(DisplayOptions);