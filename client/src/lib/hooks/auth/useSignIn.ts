import { SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { loginUser } from "@/state/Reducers/Athentication/thunks";

export type SigninStatus = "pending" | "success" | "failed" | "idle";
export type SigninError = "Invalid email or password" | null;

interface useSignin {
  status: SigninStatus;
  setStatus: React.Dispatch<SetStateAction<SigninStatus>>;
  loginErr?: SigninError;
}

export const useSignIn = (
  userEmail: string | null,
  userPassword: string | null,
): useSignin => {
  const [status, setStatus] = useState<SigninStatus>("idle");
  const [loginErr, setLoginErr] = useState<SigninError>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === null) return;

    const executeSignin = async () => {
      if (userEmail === null || userPassword === null) return;

      const signin = await dispatch(
        loginUser({ email: userEmail, password: userPassword }),
      );
    };

    if (status === "pending") {
      executeSignin();
    }
  }, [status]);

  return { status, setStatus, loginErr };
};
