import { completeResearch } from "@/state/Reducers/Investigate/research/ResearchSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import type { AppDispatch } from "@/state/store";
import RenderStanceOption from "./containers/RenderStanceOption";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";

export type Opt = "initial" | "Opt-in" | "Opt-out";

export default function Stance({
  research,
}: {
  research: Extract<
    UserResearchType,
    { phase: "reflection" } | { phase: "completed" }
  >;
}) {
  const [option, setOption] = useState<Opt>("initial");
  const dispatch = useDispatch<AppDispatch>();

  const chooseOption = (option: Opt) => {
    setOption(option);
    if (option === "Opt-out") {
      dispatch(completeResearch());
    }
  };

  return (
    <section className="w-full h-full xs:px-6 flex flex-col gap-y-1 items-center content-center mx-auto">
      <RenderStanceOption
        option={option}
        research={research}
        chooseOption={chooseOption}
      />
    </section>
  );
}
