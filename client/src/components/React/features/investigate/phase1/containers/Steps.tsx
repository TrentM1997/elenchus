import { useSelector } from "react-redux";
import StepHeader from "../components/steps/StepHeader";
import Stepper from "../components/steps/Stepper";
import { RootState } from "@/state/store";

export default function Steps(): JSX.Element | null {
  const wizardStep = useSelector(
    (s: RootState) => s.investigation.stepper.wizardStep,
  );

  return (
    <section
      className="h-60 sm:h-72 md:h-80 lg:h-88 2xl:h-96
      2xl:w-168 xl:w-[36rem] lg:w-[35rem] md:w-[29rem] 
      rounded-4xl bg-ebony/50 shadow-inset p-4 shrink-0 mx-auto 
      w-full max-w-full sm:w-[27rem] mb-4 md:mb-0
      transition-all duration-400 animate-fade-in 
      delay-300 no-scrollbar box-border min-w-80"
    >
      <div
        className="flex flex-col items-start
        justify-start relative w-full h-full p-2"
      >
        <StepHeader
          info={wizardStep.help}
          title={wizardStep.head.title}
          subheader={
            wizardStep.current === "idea"
              ? wizardStep.head.subheader
              : undefined
          }
        />

        <Stepper />
      </div>
    </section>
  );
}
