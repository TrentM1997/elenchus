import { UserKind } from "@/state/Reducers/Athentication/Authentication";
import RenderSaveInvestigationButtons from "./RenderSaveInvestigationButtons";
import React from "react";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

// → TODO: create button for optional sign up to save work for anonymous user case

export default function RenderFinalOptionsByUserKind({
  userKind,
}: {
  userKind: UserKind;
}) {
  switch (userKind) {
    case "anonymous": {
      return null;
    }
    case "authenticated": {
      return (
        <React.Fragment>
          <RenderSaveInvestigationButtons />;
        </React.Fragment>
      );
    }

    default: {
      return assertNever(userKind);
    }
  }
}
