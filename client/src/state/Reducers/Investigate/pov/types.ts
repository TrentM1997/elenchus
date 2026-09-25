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

export type WizardStepType = {
  current: WizardStep;
  status: StepProgress;
};
