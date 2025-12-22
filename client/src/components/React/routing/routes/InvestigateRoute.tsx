import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import InvestigationWorkSpace from "@/components/React/features/investigate/shared/containers/InvestigationWorkSpace";
import { useBodyLock } from "@/hooks/useBodyLock";
import type { TooltipDisplayed } from "@/state/Reducers/Investigate/Rendering";
import { useClearInvestigation } from "@/hooks/flags/useClearInvestigation";


export default function InvestigateContainer() {
  const tooltip: TooltipDisplayed = useSelector((s: RootState) => s.investigation.rendering.tooltip);
  const gettingHelp = useSelector((s: RootState) => s.investigation.help.gettingHelp);
  const { removeTooltip } = useClearInvestigation()
  useBodyLock();

  return (
    <main
      onClick={() => removeTooltip(tooltip)}
      className={`
        max-w-dvw sm:w-full shrink-0 flex flex-col grow 
        transition-opacity duration-200 ease-in-out h-full mx-auto justify-center
        items-center relative box-border min-h-svh
        ${gettingHelp
          ? 'opacity-60 pointer-events-none'
          : 'opacity-100 pointer-events-auto'}`
      }
    >
      <InvestigationWorkSpace />
    </main>
  );
};