import TakeNotes from "../buttons/TakeNotes";
import { FinishedReading } from "../buttons/FinishedReading";
import ReturnToSearch from "../buttons/ReturnToSearch";
import GetInfo from "../buttons/GetInfo";
import { useIsMobile } from "@/lib/hooks/rendering/useIsMobile";
import { ArticleExtractionState } from "@/state/Reducers/Investigate/articles/types";
import { JSX, Fragment } from "react";

export default function ControlPanelButtons({
  status,
}: {
  status: ArticleExtractionState["status"];
}): JSX.Element {
  const isMobile = useIsMobile();

  return <RenderControlButtons status={status} isMobile={isMobile} />;
}

function RenderControlButtons({
  isMobile,
  status,
}: {
  isMobile: boolean;
  status: ArticleExtractionState["status"];
}) {
  if (isMobile) {
    return (
      <Fragment>
        <ReturnToSearch />
        <FinishedReading />
        <TakeNotes status={status} />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <ReturnToSearch />
      <FinishedReading />
      <GetInfo status={status} />
      <TakeNotes status={status} />
    </Fragment>
  );
}
