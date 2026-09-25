import { useEffect, useState } from "react";
import {
  emailValidation,
  requiredInput,
  confirmPassword,
} from "@/lib/helpers/formatting/validation";

type CheckStatusType = "confirmation" | "n/a";

export type ValidStatus = "initial" | "invalid" | "valid";

const useCheckCredentials = (
  userEmail: string | null,
  userPassword: string | null,
  secondPW?: string | null,
) => {
  const [validEmail, setValidEmail] = useState<ValidStatus>("initial");
  const [acceptedInput, setAcceptedInput] = useState<ValidStatus>("initial");
  const [checkStatus, setCheckStatus] = useState<CheckStatusType>("n/a");

  useEffect(() => {
    if (userEmail === "" || userPassword === "") return;

    if (userEmail) {
      setValidEmail(emailValidation(userEmail));
    }
    if (userEmail && userPassword) {
      const result = requiredInput(userEmail, userPassword);
      setAcceptedInput(result.status);
    }
  }, [userEmail, userPassword]);

  useEffect(() => {
    if (secondPW) {
      setCheckStatus("confirmation");
    }

    if (checkStatus === "confirmation") {
      const valid = confirmPassword(userPassword, secondPW);
      setAcceptedInput(valid ? "valid" : "invalid");
    }
  }, [secondPW]);

  return { validEmail, acceptedInput };
};

export { useCheckCredentials };
