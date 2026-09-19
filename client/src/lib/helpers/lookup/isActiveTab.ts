import { ActiveTab } from "@/state/Reducers/Dashboard/UserContent/DashboardTabs";

export const isInvestigationsTab = (tab: ActiveTab) =>
  tab === "Investigations" ||
  tab === "Review Investigation" ||
  tab === "Associated Article";

export const isArticlesTab = (tab: ActiveTab) =>
  tab === "Articles" || tab === "Review Article";
