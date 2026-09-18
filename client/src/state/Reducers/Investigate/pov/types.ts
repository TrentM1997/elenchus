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
