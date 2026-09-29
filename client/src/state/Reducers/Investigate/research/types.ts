import {
  PersistInvestigationInputSchemaType,
  SelectedInvestigationPayloadSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { AsyncState } from "@/state/types";
import { WikiResponseSchemaType } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export type SaveInvestigationState =
  AsyncState<SelectedInvestigationPayloadSchemaType>;

export type PerspectiveFraming = Pick<
  PersistInvestigationInputSchemaType,
  "biases" | "idea" | "initial_perspective" | "premises" | "expertise"
>;

export type ResearchReflection = Pick<
  PersistInvestigationInputSchemaType,
  | "ending_perspective"
  | "changed_opinion"
  | "had_merit"
  | "new_concepts"
  | "takeaway"
>;

export type ExtractsAndSources = {
  extracts: Exclude<WikiResponseSchemaType, { kind: "error" }>[];
  sources: ArticleSchemaType["id"][];
};

export type UserResearchType =
  | { phase: "initial" }
  | {
      phase: "framing";
      data: {
        framing: PerspectiveFraming;
      };
    }
  | {
      phase: "searching";
      data: {
        framing: PerspectiveFraming;
      };
    }
  | {
      phase: "evidence";
      data: {
        framing: PerspectiveFraming;
        context: ExtractsAndSources;
      };
    }
  | {
      phase: "reflection";
      data: {
        framing: PerspectiveFraming;
        context: ExtractsAndSources;
        reflection: ResearchReflection;
      };
    }
  | {
      phase: "completed";
      data: {
        framing: PerspectiveFraming;
        context: ExtractsAndSources;
        reflection: ResearchReflection;
      };
    }
  | {
      phase: "end";
      data: {
        framing: PerspectiveFraming;
        context: ExtractsAndSources;
        reflection: ResearchReflection;
      };
    };
