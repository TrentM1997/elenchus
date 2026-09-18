import { ArticleExtractionState } from "@/state/Reducers/Investigate/articles/types";
import type { JSX } from "react";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import ControlPanel from "../controls/ControlPanel";

export function RenderControlPanel({
  state,
}: {
  state: ArticleExtractionState;
}): JSX.Element | null {
  switch (state.status) {
    case "initial":
    case "pending": {
      return null;
    }
    case "partial":
    case "ready":
    case "failed":
    case "error": {
      return <ControlPanel />;
    }

    default: {
      return assertNever(state);
    }
  }
}
