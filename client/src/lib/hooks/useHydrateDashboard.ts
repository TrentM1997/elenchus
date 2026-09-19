import { hydrateDashboard } from "@/state/Reducers/Dashboard/thunks";
import { AppDispatch } from "@/state/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useHydrateDashboard = (): void => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeHydrateDashboard = async () => {
      await dispatch(hydrateDashboard());
    };

    void executeHydrateDashboard();
  }, [dispatch]);
};
