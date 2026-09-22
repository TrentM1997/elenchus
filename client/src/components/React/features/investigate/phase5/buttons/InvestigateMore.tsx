import { RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCachedPlayStates,
  PLAYSTATE_KEYS,
} from "@/hooks/flags/useClearInvestigation";
import { CLEAR_INVESTIGATION } from "@/state/Reducers/Root/InvestigateReducer";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";

export default function InvestigateMore() {
  const userKind = useSelector((state: RootState) => state.auth.userKind);
  const status = useSelector(
    (s: RootState) => s.investigation.research.persistence.status,
  );
  const dispatch = useDispatch();

  const showModal = () => {
    if (status === "ready" && userKind === "authenticated") {
      dispatch({ type: CLEAR_INVESTIGATION });
      clearCachedPlayStates(PLAYSTATE_KEYS);
    } else if (userKind === "authenticated" && status !== "ready") {
      dispatch(renderModal("Work Modal"));
    } else if (userKind === "anonymous") {
      dispatch(renderModal("Feedback Form"));
      dispatch({ type: CLEAR_INVESTIGATION });
      clearCachedPlayStates(PLAYSTATE_KEYS);
    }
  };

  return (
    <button
      disabled={status !== "pending"}
      onClick={showModal}
      className="2xl:w-60 bg-white hover:bg-white/10 group shadow-thick 
                    transition-colors duration-200 ease-in-out rounded-full h-fit py-2 px-4 mx-auto flex items-center"
    >
      <p className="text-black w-full text-xs 2xl:text-lg text-nowrap group-hover:text-white font-light text-center">
        Investigate More <span className="ml-2">&#8594;</span>
      </p>
    </button>
  );
}
