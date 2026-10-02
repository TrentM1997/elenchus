import { useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/state/store";
import { deleteAccount } from "@/state/Reducers/Athentication/thunks";
import { requiredInput } from "@/lib/helpers/formatting/validation";
import { renderModal } from "@/state/Reducers/Overlay/PipelineSlice";
import { wait } from "@/lib/helpers/formatting/Presentation";
import { useNavigate } from "react-router-dom";

export type Credentials = { email: string; password: string };

export const useDeleteAccountForm = () => {
  const navigate = useNavigate();
  const toast = useSelector((s: RootState) => s.overlay.toast);
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });

  const inFlight =
    toast.kind === "delete account" && toast.status === "pending";
  const dispatch = useDispatch<AppDispatch>();

  const getInput = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Credentials,
  ) => {
    if (inFlight) return;

    const value = e.target.value;
    setCredentials((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const executeDelete = async ({
    email,
    password,
  }: {
    email: Credentials["email"];
    password: Credentials["password"];
  }) => {
    const result = await dispatch(
      deleteAccount({
        email,
        password,
      }),
    ).unwrap();

    if (result.ok) {
      await wait(1000);
      dispatch(renderModal(null));
      await wait(200);
      navigate("/");
    }
  };

  const checkValidationStatus = (credentials: Credentials) => {
    if (credentials.email === "" && credentials.password === "")
      return "initial";
    const result = requiredInput(credentials.email, credentials.password);
    return result.status;
  };

  const validationStatus = checkValidationStatus(credentials);

  const submit = async () => {
    if (inFlight || validationStatus !== "valid") return;
    try {
      await executeDelete({
        email: credentials.email,
        password: credentials.password,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getInput,
    submit,
    credentials,
    validationStatus,
    submission: toast.status,
  };
};
