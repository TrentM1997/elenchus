import DashboardOption from "./DashboardOption";
import BookmarkIcon from "@/components/React/Shared/IconComponents/BookmarkIcon";
import MetricsIcon from "@/components/React/Shared/IconComponents/MetricsIcon";
import InvestigationsIcon from "@/components/React/Shared/IconComponents/InvestigateIcon";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { presentMetrics, presentResearch, presentArticles } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";
import React from "react";

function DisplayOptions() {
    const { displaySavedArticles, displayMetrics, displaySavedInvestigations, displayThisInvestigation, displayThisArticle } = useSelector((state: RootState) => state.profileNav, shallowEqual);
    const investigations_innit = (displaySavedInvestigations || displayThisInvestigation);
    const articles_innit = (displaySavedArticles || displayThisArticle);

    return (
        <ul
            id="dashboard-controls"
            className="space-y-2 font-medium">

            <DashboardOption name="Metrics" activeCondition={displayMetrics} actionCreator={presentMetrics}>
                <MetricsIcon active={displayMetrics} />
            </DashboardOption>

            <DashboardOption name="Investigations" activeCondition={investigations_innit} actionCreator={presentResearch}>
                <InvestigationsIcon active={investigations_innit} />
            </DashboardOption>

            <DashboardOption name="Saved Articles" activeCondition={articles_innit} actionCreator={presentArticles}>
                <BookmarkIcon active={articles_innit} />
            </DashboardOption>
        </ul>
    );
};

export default React.memo(DisplayOptions);