import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthNotification from "@/components/React/session/notifications/AuthNotification";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import LoginOperations from "@/components/React/session/forms/containers/LoginOperations";
import { useCheckCredentials } from "@/hooks/useCheckCredentials";
import { useSignIn } from "@/hooks/useSignIn";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import InvalidCredentials from "../fallbacks/InvalidCredentials";
import { renderToast } from "@/state/Reducers/RenderingPipelines/PipelineSlice";

export default function Login(): JSX.Element {
  const activeSession = useSelector(
    (state: RootState) => (state.auth.userKind === "authenticated"),
  );
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPassword, setUserPassword] = useState<string | null>(null);
  const { status, setStatus, loginErr } = useSignIn(userEmail, userPassword);
  const { acceptedInput, validEmail } = useCheckCredentials(
    userEmail,
    userPassword,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const submitAuth = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (acceptedInput === "valid" && userPassword) {
      setStatus("pending");
    }
  };

  useEffect(() => {
    if (!activeSession) return;

    const timer = window.setTimeout(() => {
      navigate("/");
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [activeSession]);

  return (
    <section className="lg:p-8 overflow-hidden bg-black animate-fade-in">
      <ScrolltoTop />
      <AnimatePresence>
        {status !== "idle" && (
          <AuthNotification toast={{ status, kind: "Auth", action: "login" }} />
        )}
      </AnimatePresence>
      <div className="mx-auto 2xl:max-w-7xl py-24 lg:px-16 md:px-12 px-8 xl:px-36">
        <div className="border-b">
          <p className="text-3xl tracking-tight font-light lg:text-4xl text-white">
            Log in.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            log in to manage your saved content.
          </p>
          <AnimatePresence>
            {loginErr ? (
              <InvalidCredentials error={loginErr} />
            ) : (
              <div className="h-16 w-full" />
            )}
          </AnimatePresence>
        </div>
        <LoginOperations
          submitAuth={submitAuth}
          setUserEmail={setUserEmail}
          setUserPassword={setUserPassword}
          validEmail={validEmail === "valid"}
          acceptedInput={acceptedInput === "valid"}
        />
      </div>
    </section>
  );
}
