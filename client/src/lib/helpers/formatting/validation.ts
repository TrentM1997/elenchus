import { ValidStatus } from "@/lib/hooks/validation/useCheckCredentials";

const checkSpecialChars = (arr: string[]) => {
  const checkChars = /[!@#$%^&*(),.?":{}|<>]/;

  const isFalse = (element: boolean) => element === false;

  const chars = arr.map((char: string) => {
    return checkChars.test(char);
  });

  return chars.every(isFalse);
};

export const requiredInput = (
  emailString: string,
  passwordString: string,
):
  | { email: string; password: string; status: "valid" }
  | { status: "invalid" } => {
  const validateEmail = /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/gm;

  const isValidEmail = validateEmail.test(emailString);

  let splitPassword = passwordString.split("");

  let validLength = splitPassword.length >= 8;

  const noSpecialChars = checkSpecialChars(splitPassword);

  if (noSpecialChars) {
    return {
      status: "invalid",
    };
  }

  if (validLength && isValidEmail && !noSpecialChars) {
    return { email: emailString, password: passwordString, status: "valid" };
  } else {
    return { status: "invalid" };
  }
};

export const emailValidation = (emailEvaluated: string): ValidStatus => {
  const validateEmail = /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/gm;

  const isValidEmail = validateEmail.test(emailEvaluated);

  if (isValidEmail) return "valid";

  return "invalid";
};

export const confirmPassword = (
  firstEntry?: string | null,
  secondEntry?: string | null,
) => {
  if (!firstEntry) return;
  const splitPW = firstEntry.split("");

  const longEnough = splitPW.length >= 8;

  const noSpecialChars = checkSpecialChars(splitPW);

  if (noSpecialChars) {
    return false;
  }

  if (firstEntry === secondEntry && !noSpecialChars && longEnough) {
    return true;
  } else {
    return false;
  }
};

export const confirmFirstPassword = (firstEntry: string): boolean => {
  const splitPW = firstEntry.split("");
  const longEnough = splitPW.length >= 8;
  const noSpecialChars = checkSpecialChars(splitPW);

  if (!noSpecialChars && longEnough) {
    return true;
  } else {
    return false;
  }
};
