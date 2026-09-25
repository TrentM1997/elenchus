import { selectPOVData } from "@/state/Reducers/Investigate/pov/selectors";
import { startTransition, useEffect, useLayoutEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ErrorBoundary from "../../../global/ErrorBoundaries/ErrorBoundary";
import { selectPost } from "@/state/Reducers/BlueSky/BlueSkySlice";
import SearchBlueSky from "../Components/input/SearchBlueSky";
import BlueSkyHeader from "../Components/BlueSkyHeader";
import CloseBlueSky from "../Components/buttons/CloseBlueSky";
import { useNavigate } from "react-router-dom";
import FeedContainer from "./FeedContainer";

interface BlueSkyProps {
  context: "home" | "investigate";
  shouldAnimate?: boolean;
}

export default function BlueSky({
  context,
  shouldAnimate = true,
}: BlueSkyProps) {
  const posts = useSelector((state: RootState) => state.bluesky.posts);
  const navigate = useNavigate();
  const { idea } = useSelector(selectPOVData);
  const dispatch = useDispatch();
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
  }, [idea, shouldRedirect]);

  return (
    <div className="lg:p-8 w-full relative opacity-0 animate-fade-in animation-delay-200ms ease-soft">
      <div className="mt-12 md:mt-6 p-4 w-full py-6 mx-auto md:px-12 lg:px-0  2xl:max-w-7xl h-full">
        <div
          className="bg-gradientup mx-auto flex flex-col p-6 lg:p-0 shrink-0 
        grow rounded-4xl w-full h-auto md:max-w-5xl lg:max-w-6xl 2xl:min-w-6xl 
        xl:max-w-7xl relative overflow-hidden"
        >
          {context === "investigate" && <CloseBlueSky />}
          <BlueSkyHeader>
            <SearchBlueSky />
          </BlueSkyHeader>

          <ErrorBoundary>
            <FeedContainer
              shouldAnimate={shouldAnimate}
              key={"postsfetched"}
              context={context}
              posts={posts}
              shouldRedirect={shouldRedirect}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
