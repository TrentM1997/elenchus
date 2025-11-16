import { useEffect, useMemo } from "react";
import { RootState } from "@/ReduxToolKit/store";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/ReduxToolKit/store";
import InvestigationWorkSpace from "@/components/React/features/investigate/shared/containers/InvestigationWorkSpace";
import { useBodyLock } from "@/hooks/useBodyLock";
import { ModalDisplayed, populateTooltip, TooltipDisplayed } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import { useTooltipFlags } from "@/hooks/useTooltipFlags";
import { wait } from "@/helpers/Presentation";

export const PLAYSTATE_KEYS = [
  'previous-biases',
  'previous-perspective',
  'previous-expertise',
];

export function clearCachedPlayStates(keys: Array<string>) {
  try {
    for (const k of keys) {
      sessionStorage.removeItem(k)

    }
  } catch (err) {
    console.error(err);
  }
};

export default function InvestigateContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const tooltip: TooltipDisplayed = useSelector((s: RootState) => s.investigation.rendering.tooltip);
  const { getFlags, setFlag } = useTooltipFlags();
  const gettingHelp = useSelector(
    (s: RootState) => s.investigation.help.gettingHelp
  );
  const signingOut = useSelector((s: RootState) => s.auth.signOut);
  useBodyLock();

  async function removeToolTip(tooltip: TooltipDisplayed) {
    const flags = getFlags();
    await wait(100);
    if (tooltip === 'Guide Selection' && (flags.selectingTooltip === false)) {
      setFlag('selectingTooltip', true);
      dispatch(populateTooltip(null))

    } else if (tooltip === 'Finished Reading Button' && (flags.readingTooltip === false)) {
      setFlag('readingTooltip', true);
      dispatch(populateTooltip(null))

    }
  };

  useEffect(() => {



    return () => {
      clearCachedPlayStates(PLAYSTATE_KEYS);
      dispatch({ type: 'clear' })
    }
  }, []);

  return (
    <main
      onClick={() => removeToolTip(tooltip)}
      className={`
        max-w-dvw sm:w-full shrink-0 flex flex-col grow 
        transition-opacity duration-200 ease-in-out h-full mx-auto justify-center
        items-center relative box-border min-h-svh
        ${signingOut || gettingHelp
          ? 'opacity-80 pointer-events-none'
          : 'opacity-100 pointer-events-auto'}`
      }
    >
      {/* Core workspace for search and article content */}
      <InvestigationWorkSpace />


    </main>
  );
};

