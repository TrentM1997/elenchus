import LoginForm from "../AuthForms/LoginForm";
import { OAuthLogins } from "../InputFields/OauthLogins";

export default function LoginOperations() {
  return (
    <div className="w-full gap-24 mx-auto grid grid-cols-1 mt-12 lg:grid-cols-2 items-center">
      <LoginForm />
      <OAuthLogins />
    </div>
  );
}
