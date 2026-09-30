import { useEffect, useRef, startTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/state/store";
import { useNavigate } from "react-router-dom";
import { selectPost } from "@/state/Reducers/BlueSky/BlueSkySlice";
import { selectPOVData } from "@/state/Reducers/Investigate/pov/selectors";

export const useRedirectFromLandingPage = (context: "home" | "investigate") => {
  const posts = useSelector((state: RootState) => state.bluesky.posts);
  const navigate = useNavigate();
  const { idea } = useSelector(selectPOVData);
  const dispatch = useDispatch<AppDispatch>();
  const shouldRedirect: boolean = context === "home";
  const redirectTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!idea) return;

    if (idea && shouldRedirect) {
      redirectTimer.current = window.setTimeout(() => {
        startTransition(() => {
          navigate("/investigate");
        });
        redirectTimer.current = null;
      }, 850);
    }

    return () => {
      if (redirectTimer.current !== null) {
        clearTimeout(redirectTimer.current);
      }
      dispatch(selectPost({ status: "initial" }));
    };
  }, [idea, shouldRedirect, dispatch]);

  return {
    shouldRedirect,
    posts,
  };
};
