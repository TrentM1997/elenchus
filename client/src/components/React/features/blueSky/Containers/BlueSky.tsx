import ErrorBoundary from "../../../global/ErrorBoundaries/ErrorBoundary";
import SearchBlueSky from "../Components/input/SearchBlueSky";
import BlueSkyHeader from "../Components/BlueSkyHeader";
import CloseBlueSky from "../Components/buttons/CloseBlueSky";
import FeedContainer from "./FeedContainer";
import { useRedirectFromLandingPage } from "@/lib/hooks/blueSky/useRedirectFromLandingPage";

interface BlueSkyProps {
  context: "home" | "investigate";
  shouldAnimate?: boolean;
}

export default function BlueSky({
  context,
  shouldAnimate = true,
}: BlueSkyProps) {
  const { posts, shouldRedirect } = useRedirectFromLandingPage(context);

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
