import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import type { DashboardTab } from "@/state/Reducers/Dashboard/types";
import ArticleReview from "@/components/React/features/dashboard/Content/UserArticles/containers/ArticleReview";
import ResearchReview from "@/components/React/features/dashboard/Content/SavedInvestigations/containers/ResearchReview";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { changeTab } from "@/state/Reducers/Dashboard/DashboardSlice";

type OpenInvestigationTab = Extract<
  DashboardTab,
  {
    kind: "investigations";
    display: "review";
    current: "investigation";
    investigationId: InvestigationSchemaType["id"];
  }
>;

type OpenSourceTab = Extract<
  DashboardTab,
  {
    kind: "investigations";
    display: "review";
    current: "article";
    investigationId: InvestigationSchemaType["id"];
    articleId: ArticleSchemaType["id"];
  }
>;

type RenderInvestigationTabProps = {
  tab: OpenSourceTab | OpenInvestigationTab;
};

export default function RenderInvestigationReviewTab({
  tab,
}: RenderInvestigationTabProps) {
  const dispatch = useDispatch<AppDispatch>();

  const backToInvestigations = () => {
    dispatch(
      changeTab({
        kind: "investigations",
        display: "review",
        current: "investigation",
        investigationId: tab.investigationId,
      }),
    );
  };

  switch (tab.current) {
    case "investigation": {
      return (
        <ResearchReview
          key={tab.investigationId}
          investigationId={tab.investigationId}
        />
      );
    }
    case "article": {
      return (
        <ArticleReview
          key={tab.articleId}
          backTo={backToInvestigations}
          articleId={tab.articleId}
        />
      );
    }

    default: {
      return assertNever(tab);
    }
  }
}
