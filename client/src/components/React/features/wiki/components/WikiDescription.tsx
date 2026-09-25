import { useRef } from "react";
import { useScrollTrap } from "@/lib/hooks/rendering/useOverScrollTrap";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import RenderWikiExtractByKind from "./RenderWikiExtractByKind";
import AsyncStateRenderer from "@/components/React/pipelines/AsyncStateRenderer";
import WikiExtractLoader from "../loaders/WikiExtractLoader";
import ExtractError from "./errors/ExtractError";

export default function Description(): JSX.Element | null {
  const extract = useSelector((s: RootState) => s.investigation.wiki.extract);
  const scrollRef = useRef(null);
  useScrollTrap(scrollRef);

  return (
    <AsyncStateRenderer
      state={extract}
      pending={() => <WikiExtractLoader />}
      failed={() => <ExtractError />}
    >
      {(state) => <RenderWikiExtractByKind extract={state} />}
    </AsyncStateRenderer>
  );
}
