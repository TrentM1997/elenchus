import { SetStateAction } from "react";
import LoginForm from "../AuthForms/LoginForm";
import { OAuthLogins } from "../InputFields/OauthLogins";

interface LoginOperations {
  submitAuth: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  setUserEmail: React.Dispatch<SetStateAction<string | null>>;
  setUserPassword: React.Dispatch<SetStateAction<string | null>>;
  validEmail: boolean;
  acceptedInput: boolean;
}

export default function LoginOperations({
  submitAuth,
  setUserEmail,
  setUserPassword,
  validEmail,
  acceptedInput,
}: LoginOperations) {
  return (
    <div
      className="w-full gap-24 mx-auto grid 
    grid-cols-1 mt-12 lg:grid-cols-2 items-center"
    >
      <LoginForm
        submitAuth={submitAuth}
        setUserEmail={setUserEmail}
        setUserPassword={setUserPassword}
        validEmail={validEmail}
        acceptedInput={acceptedInput}
      />
      <OAuthLogins />
    </div>
  );
}
