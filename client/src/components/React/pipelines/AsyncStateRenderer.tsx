import { type ReactNode, type JSX, Fragment } from "react";
import type { AsyncState } from "@/state/types";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import PendingState from "@/components/React/global/fallbacks/PendingState";
import FailedState from "@/components/React/global/fallbacks/FailedState";
import EmptyState from "@/components/React/global/fallbacks/EmptyState";

type AsyncStateRendererProps<
  T,
  EmptyMessage extends string = "No data found",
> = {
  state: AsyncState<T, EmptyMessage>;
  children: (data: T) => ReactNode;
  empty?: (message: EmptyMessage) => ReactNode;
  pending?: () => ReactNode;
  initial?: () => ReactNode;
  failed?: (error: string) => ReactNode;
};

export default function AsyncStateRenderer<
  T,
  EmptyMessage extends string = "No data found",
>({
  state,
  children,
  empty,
  initial,
  pending,
  failed,
}: AsyncStateRendererProps<T, EmptyMessage>): JSX.Element | null {
  switch (state.status) {
    case "initial": {
      return null;
    }
    case "failed": {
      const failedNode = failed ? (
        failed(state.details)
      ) : (
        <FailedState message={state.details || undefined} />
      );

      if (failedNode == null) return null;
      return <div className="motion-safe:animate-fade-in">{failedNode}</div>;
    }
    case "empty": {
      const emptyNode = empty ? (
        empty(state.message)
      ) : (
        <EmptyState message={state.message} />
      );

      if (emptyNode == null) return null;
      return <div className="motion-safe:animate-fade-in">{emptyNode}</div>;
    }
    case "pending": {
      return <Fragment>{pending ? pending() : <PendingState />}</Fragment>;
    }

    case "ready": {
      return <Fragment>{children(state.data)}</Fragment>;
    }

    default: {
      return assertNever(state);
    }
  }
}
