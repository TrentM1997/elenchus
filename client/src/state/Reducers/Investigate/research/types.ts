import {
  InvestigationSaveResponseType,
  PersistInvestigationInputSchemaType,
} from "@/lib/schemas/investigations/InvestigationSchema";
import { AsyncState } from "@/state/types";

export type SaveInvestigationState = AsyncState<InvestigationSaveResponseType>;

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

export type SourcesAndExtracts = Pick<
  PersistInvestigationInputSchemaType,
  "sources" | "wikipedia_extracts"
>;

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
        context: SourcesAndExtracts;
      };
    }
  | {
      phase: "reflection";
      data: {
        framing: PerspectiveFraming;
        context: SourcesAndExtracts;
        reflection: ResearchReflection;
      };
    }
  | {
      phase: "completed";
      data: {
        framing: PerspectiveFraming;
        context: SourcesAndExtracts;
        reflection: ResearchReflection;
      };
    }
  | {
      phase: "end";
      data: {
        framing: PerspectiveFraming;
        context: SourcesAndExtracts;
        reflection: ResearchReflection;
      };
    };
