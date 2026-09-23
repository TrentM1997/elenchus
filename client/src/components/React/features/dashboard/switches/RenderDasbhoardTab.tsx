import type { JSX } from "react";
import type { DashboardTab } from "@/state/Reducers/Dashboard/types";
import Metrics from "@/components/React/features/dashboard/Content/containers/Metrics";
import AccManagement from "@/components/React/features/dashboard/ProfileNavigation/AccountManagement/AccManagement";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import RenderArticleTab from "./RenderArticleTab";
import RenderInvestigationTab from "./RenderInvestigationTab";

export default function RenderDasbhoardTab({
  tab,
}: {
  tab: DashboardTab;
}): JSX.Element {
  switch (tab.kind) {
    case "metrics":
      return <Metrics />;
    case "manage account":
      return <AccManagement />;
    case "articles": {
      return <RenderArticleTab tab={tab} />;
    }
    case "investigations": {
      return <RenderInvestigationTab tab={tab} />;
    }

    default: {
      return assertNever(tab);
    }
  }
}
