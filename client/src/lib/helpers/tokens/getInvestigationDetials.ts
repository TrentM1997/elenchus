import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";

interface InvestigationData {
  id: string;
  icon: string;
  title: string | null;
  description: string | null;
}

interface ThoughtMap {
  idea: string | null;
  initial_perspective: string | null;
  biases: string | null;
  premises: string | null;
  ending_perspective: string | null;
  changed_opinion: boolean | null;
}

export function getInvestigationDetialsTableCopy(
  investigation: InvestigationSchemaType,
) {
  const {
    idea,
    initial_perspective,
    biases,
    premises,
    ending_perspective,
    changed_opinion,
  } = investigation;

  const investigationDetails: InvestigationData[] = [
    {
      id: "easyIntegration",
      icon: "integration",
      title: "Idea Tackled",
      description: `${idea}`,
    },
    {
      id: "customizableOrdering",
      icon: "customizable",
      title: "Initial Perspective",
      description: `${initial_perspective ? initial_perspective : "N/A"}`,
    },
    {
      id: "realTimeTracking",
      icon: "tracking",
      title: "Biases",
      description: `${biases ? biases : "N/A"}`,
    },
    {
      id: "automatedReporting",
      icon: "reporting",
      title: "Premises of Idea",
      description: `${premises ? premises : "N/A"}`,
    },
    {
      id: "scalableSolutions",
      icon: "scalable",
      title: "Once you dug in",
      description: `${changed_opinion === true ? "You had a shift in perspective, having been moved by the evidence" : "You weren't moved to change your perspective by the available evidence"}`,
    },
    {
      id: "secureDataManagement",
      icon: "secure",
      title: "Ending Perspective",
      description: `${
        ending_perspective !== null
          ? `${ending_perspective === "Agree" ? "You ended your investigation in agreement with the idea being evaluated" : ""} 
                 ${ending_perspective === "Disagree" ? "You ended your investigation rejecting the idea being evaluated" : ""} 
                 ${ending_perspective === "Neutral" ? "You were on the fence about this idea by the end of your research. Perhaps more inquiry is needed" : ""}`
          : "You did not share your final perspective on the idea"
      }`,
    },
  ];

  return { investigationDetails };
}
