import EndInvestigateButton from "../buttons/FinishInvestigation";
import { updateReflection } from "@/state/Reducers/Investigate/research/ResearchSlice";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { Opt } from "../Stance";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import { TakeAway } from "../TakeAway";
import OptionFortakeaway from "../buttons/OptionForTakeAway";

export default function RenderStanceOption({
  option,
  research,
  chooseOption,
}: {
  option: Opt;
  research: Extract<
    UserResearchType,
    { phase: "reflection" } | { phase: "completed" }
  >;
  chooseOption: (option: Opt) => void;
}) {
  const reflection = research.data.reflection;
  const takeAway = reflection.takeaway ?? null;
  const newPOV = reflection.changed_opinion;
  const getTakeAways = (takeaway: string) =>
    updateReflection({ ...reflection, takeaway });

  switch (option) {
    case "initial": {
      return <OptionFortakeaway key={"options"} chooseOption={chooseOption} />;
    }
    case "Opt-in": {
      return (
        <TakeAway
          key={"input-takeaway"}
          getTakeAways={getTakeAways}
          newPOV={newPOV}
          takeAway={takeAway}
        />
      );
    }
    case "Opt-out": {
      return <EndInvestigateButton key={"endbutton"} />;
    }

    default: {
      return assertNever(option);
    }
  }
}
