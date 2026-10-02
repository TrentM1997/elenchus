import { lazy, Suspense } from "react";
import InputOptions from "../phase1/components/paths/InputOptions";
import BlueSkySkeleton from "../../blueSky/skeletons/BlueSkySkeleton";
const BlueSkyPosts = lazy(
  () => import("@/components/React/features/blueSky/Containers/BlueSky"),
);
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import { UserResearchType } from "@/state/Reducers/Investigate/research/types";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

type RenderInitialPhaseProps = {
  state: Extract<UserResearchType, { phase: "initial" }>;
};

export default function RenderInitialPhase({
  state,
}: RenderInitialPhaseProps): JSX.Element | null {
  switch (state.path) {
    case "choose": {
      return <InputOptions />;
    }
    case "browse blueSky": {
      return (
        <Suspense
          key={"Bluesky-boundary"}
          fallback={
            <DelayedFallback>
              <BlueSkySkeleton context={"investigate"} />
            </DelayedFallback>
          }
        >
          <BlueSkyPosts context={"investigate"} />
        </Suspense>
      );
    }

    case "decided":
      return null;

    default: {
      return assertNever(state.path);
    }
  }
}
