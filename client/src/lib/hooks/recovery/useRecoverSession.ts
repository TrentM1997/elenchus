import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";
import {
  authenticated,
  UserKind,
} from "@/state/Reducers/Athentication/Authentication";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";

const useRecoverSession = (): void => {
  const userKind = useLoaderData<UserKind>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeRecoverSession = () => {
      dispatch(authenticated(userKind));
    };

    void executeRecoverSession();
  }, [userKind, dispatch]);
};

export { useRecoverSession };
