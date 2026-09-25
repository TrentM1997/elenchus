import { hydrateDashboard } from "@/state/Reducers/Dashboard/thunks";
import { AppDispatch } from "@/state/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useHydrateDashboard = (): void => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const request = dispatch(hydrateDashboard());

    return () => {
      request.abort();
    };
  }, [dispatch]);
};
