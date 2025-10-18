import { useEffect } from "react";
import { RootState } from "@/ReduxToolKit/store";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/ReduxToolKit/store";
import InvestigationWorkSpace from "@/components/React/features/investigate/InvestigationWorkSpace";
import { displaySelectTooltip } from "@/ReduxToolKit/Reducers/Investigate/DisplayReducer";
import { useBodyLock } from "@/hooks/useBodyLock";
import React from "react";


const PLAYSTATE_KEYS = [
  'previous-biases',
  'previous-perspective',
  'previous-expertise',
];

function InvestigateContainer() {
  const dispatch = useDispatch<AppDispatch>()
  const showSelectTooltip = useSelector(
    (s: RootState) => s.investigation.display.showSelectTooltip
  );
  const showSearch = useSelector(
    (s: RootState) => s.investigation.display.showSearch
  );
  const status = useSelector(
    (s: RootState) => s.investigation.search.status
  );
  const gettingHelp = useSelector(
    (s: RootState) => s.investigation.help.gettingHelp
  );
  const signingOut = useSelector((s: RootState) => s.auth.signOut);

  const hasSearched = showSearch && status === "fulfilled";
  useBodyLock();

  function removeToolTip(show: boolean, searched: boolean) {
    if (show && searched) {
      dispatch(displaySelectTooltip(false));
    };
  };

  function clearCachedPlayStates(keys: Array<string>) {
    try {
      for (const k of keys) {
        sessionStorage.removeItem(k)

      }
    } catch (err) {
      console.error(err);
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
      onClick={() => removeToolTip(showSelectTooltip, hasSearched)}
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


export default React.memo(InvestigateContainer);