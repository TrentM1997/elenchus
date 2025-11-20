import StepWizard from "@/components/React/features/investigate/phase1/components/stepWizard/containers/StepWizard";
import WindowWrapper from "./WindowWrapper";

export default function GatherPOV(): JSX.Element {

    return (
        <main
            className="flex grow-0 animate-fade-in duration-300 ease-in delay-500 
            lg:items-center xl:items-end justify-center lg:px-4 2xl:gap-y-6 w-full h-full relative"
        >
            <StepWizard />
            <WindowWrapper />
        </main>
    )
};