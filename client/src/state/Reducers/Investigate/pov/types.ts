export type InitialPerspective = "Agree" | "Disagree" | "Neutral" | null;

export type TopicExpertise =
  | "New to the Topic"
  | "Familiar"
  | "Area of Expertise"
  | null;

export type PerspectiveDraft = {
  idea: string;
  perspective: InitialPerspective | null;
  expertise: TopicExpertise | null;
  biases: string;
  premises: string;
};

export type UserPointOfView = {
  idea: string;
  perspective: InitialPerspective;
  expertise: TopicExpertise;
  biases: string;
  premises: string;
};

export const stepOrder: readonly WizardStep[] = [
  "idea",
  "approach",
  "biases",
  "premises",
  "final",
];

export type PaginationStatus = "active" | "idle";

type StepProgress = "initial" | "proceed" | "halt";

export type WizardStep = "idea" | "approach" | "biases" | "premises" | "final";

export type WizardHelpInfo = { heading: string; explanation: string };

export type WizardStepType =
  | {
      current: "idea";
      head: { title: "Tackle an idea"; subheader: "from the top down" };
      status: StepProgress;
      help: { tabOne: WizardHelpInfo; tabTwo: WizardHelpInfo };
    }
  | {
      current: "approach";
      head: { title: "Your angle of approach" };
      status: StepProgress;
      help: { tabOne: WizardHelpInfo; tabTwo: WizardHelpInfo };
    }
  | {
      current: "biases";
      head: { title: "Acknowledge biases" };
      status: StepProgress;
      help: { tabOne: WizardHelpInfo };
    }
  | {
      current: "premises";
      head: { title: "Underlying premises? (optional)" };
      status: StepProgress;
      help: { tabOne: WizardHelpInfo; tabTwo: WizardHelpInfo };
    }
  | {
      current: "final";
      head: { title: "Search for evidence" };
      status: StepProgress;
      help: { tabOne: WizardHelpInfo };
    };
