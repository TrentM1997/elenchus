import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { useEffect } from "react";
import { hydrateOpenInvestigation } from "@/state/Reducers/Dashboard/thunks";
import { clearOpenedInvestigation } from "@/state/Reducers/Dashboard/DashboardSlice";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";

export const useHydrateOpenedInvestigation = (
  investigationId: InvestigationSchemaType["id"],
) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const request = dispatch(hydrateOpenInvestigation(investigationId));

    return () => {
      request.abort();
      dispatch(clearOpenedInvestigation());
    };
  }, [dispatch, investigationId]);
};
