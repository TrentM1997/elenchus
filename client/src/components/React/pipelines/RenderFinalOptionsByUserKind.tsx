import { UserKind } from "@/state/Reducers/Athentication/Authentication";
import RenderSaveInvestigationButtons from "./RenderSaveInvestigationButtons";
import React from "react";
import InvestigateMore from "../features/investigate/phase5/buttons/InvestigateMore";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function RenderFinalOptionsByUserKind({
  userKind,
}: {
  userKind: UserKind;
}) {
  switch (userKind) {
    case "anonymous": {
      return <InvestigateMore />;
    }
    case "authenticated": {
      return (
        <React.Fragment>
          <RenderSaveInvestigationButtons />;
          <InvestigateMore />
        </React.Fragment>
      );
    }

    default: {
      return assertNever(userKind);
    }
  }
}
