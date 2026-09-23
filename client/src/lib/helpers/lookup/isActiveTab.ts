import type { DashboardTab } from "@/state/Reducers/Dashboard/types";
export const isInvestigationsTab = (tab: DashboardTab) => tab.kind === "investigations";
export const isArticlesTab = (tab: DashboardTab) => tab.kind === "articles";
