import StepsEditor from "@/components/React/global/TipTap/StepsEditor";
import EndInvestigateButton from "./buttons/FinishInvestigation";

interface TakeAway {
  newPOV: any;
  takeAway: string | null;
  getTakeAways: any;
}

export function TakeAway({
  newPOV,
  takeAway,
  getTakeAways,
}: TakeAway): JSX.Element {
  return (
    <>
      <header className="xs:w-full border-b border-white/10 md:mb-2 flex justify-start">
        <div className="w-full h-auto">
          <h1 className="text-sm w-full lg:text-lg lg:mb-2 2xl:text-xl text-white font-light tracking-tight">
            {newPOV
              ? "So you changed your stance, what moved you?"
              : "What validated your initial thoughts?"}
          </h1>
        </div>
      </header>
      <main className="xs:w-full xs:h-auto mx-auto mb-4">
        <div className="w-full xs:h-32 sm:h-36 xl:h-44 2xl:h-52 bg-white/10 rounded-lg">
          <StepsEditor
            id="takeaway"
            context={takeAway}
            setterFunction={getTakeAways}
          />
        </div>
        <EndInvestigateButton />
      </main>
    </>
  );
}
