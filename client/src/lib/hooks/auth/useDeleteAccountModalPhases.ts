import { useDispatch } from "react-redux";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { useState } from "react";
import { AppDispatch } from "@/state/store";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export type DeleteAccountPhase =
  | { status: "initial" }
  | { status: "proceed" }
  | { status: "cancel" };

export const useDeleteAccountModalPhases = () => {
  const [phase, setPhase] = useState<DeleteAccountPhase>({ status: "initial" });
  const dispatch = useDispatch<AppDispatch>();

  const choose = (choice: DeleteAccountPhase["status"]) => {
    switch (choice) {
      case "initial": {
        break;
      }
      case "proceed": {
        setPhase({ status: choice });
        break;
      }
      case "cancel": {
        dispatch(renderModal(null));
        break;
      }

      default: {
        assertNever(choice);
      }
    }
  };

  return {
    phase,
    choose,
  };
};
