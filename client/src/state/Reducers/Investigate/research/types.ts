import {
  InvestigationSaveResponseType,
  PersistInvestigationInputSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { WikiDisambigCandidate } from "@/lib/services/wiki/wiki";
import { AsyncState } from "@/state/types";

export interface Extracts {
  title: string;
  extract?: string;
  associatedArticle: string;
  candidates?: WikiDisambigCandidate[];
}

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

export type WikipediaTermsExtracted = Pick<
  PersistInvestigationInputSchemaType,
  "wikipedia_extracts"
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
        context: WikipediaTermsExtracted;
      };
    }
  | {
      phase: "reflection";
      data: {
        framing: PerspectiveFraming;
        context: WikipediaTermsExtracted;
        reflection: ResearchReflection;
      };
    }
  | {
      phase: "completed";
      data: {
        framing: PerspectiveFraming;
        context: WikipediaTermsExtracted;
        reflection: ResearchReflection;
      };
    }
  | {
      phase: "end";
      data: {
        framing: PerspectiveFraming;
        context: WikipediaTermsExtracted;
        reflection: ResearchReflection;
      };
    };
