import type { ReactNode } from "react";
import StatePanel from "./StatePanel";

export type FailedStateProps = {
  title?: string;
  message?: string;
  action?: ReactNode;
};

export default function FailedState({
  title = "Couldn't load this content",
  message = "Something went wrong. Please try again in a moment.",
  action,
}: FailedStateProps) {
  return (
    <StatePanel
      title={title}
      message={message}
      action={action}
      tone="error"
      role="alert"
      icon={
        <svg
          focusable="false"
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6M12 17h.01" />
        </svg>
      }
    />
  );
}
