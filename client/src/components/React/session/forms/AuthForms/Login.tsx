import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ScrolltoTop from "@/lib/helpers/scroll/ScrollToTop";
import LoginOperations from "@/components/React/session/forms/containers/LoginOperations";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, type RootState } from "@/state/store";
import InvalidCredentials from "../fallbacks/InvalidCredentials";
import { resetLoginState } from "@/state/Reducers/Athentication/Authentication";

export default function Login(): JSX.Element {
  const status = useSelector((s: RootState) => s.auth.loginState.status);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    return () => {
      dispatch(resetLoginState());
    };
  }, [dispatch]);

  return (
    <section className="lg:p-8 overflow-hidden bg-black animate-fade-in">
      <ScrolltoTop />
      <div className="mx-auto 2xl:max-w-7xl py-24 lg:px-16 md:px-12 px-8 xl:px-36">
        <div className="border-b">
          <p className="text-3xl tracking-tight font-light lg:text-4xl text-white">
            Log in.
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            log in to manage your saved content.
          </p>
          <AnimatePresence>
            {status === "failed" ? (
              <InvalidCredentials error="Invalid email or password" />
            ) : (
              <div className="h-16 w-full" />
            )}
          </AnimatePresence>
        </div>
        <LoginOperations />
      </div>
    </section>
  );
}
