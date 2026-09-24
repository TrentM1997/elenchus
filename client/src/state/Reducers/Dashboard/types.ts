import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { AsyncState } from "@/state/types";

export type OpenedArticle = AsyncState<ArticleSchemaType>;

export type OpenInvestigation = AsyncState<InvestigationSchemaType>;

export type DashboardTab =
  | { kind: "metrics" }
  | { kind: "manage account" }
  | { kind: "articles"; display: "main" }
  | { kind: "articles"; display: "review"; articleId: ArticleSchemaType["id"] }
  | { kind: "investigations"; display: "main" }
  | {
      kind: "investigations";
      display: "review";
      current: "investigation";
      investigationId: InvestigationSchemaType["id"];
    }
  | {
      kind: "investigations";
      display: "review";
      current: "article";
      investigationId: InvestigationSchemaType["id"];
      articleId: ArticleSchemaType["id"];
    };

export type VirtuosoScrollPos =
  | { status: "initial" }
  | {
      status: "ready";
      position: {
        topKey: string | number | null;
        topIndex: number | null;
        scrollTop: number | null;
        dataVersion: number | null;
        viewportHeight?: number | null;
        savedAt?: number | null;
        listID?: "articles" | "investigations" | null;
      };
    };
