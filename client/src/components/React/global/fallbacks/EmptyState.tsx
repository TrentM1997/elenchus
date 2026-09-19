import type { ReactNode } from "react";
import StatePanel from "./StatePanel";

export type EmptyStateProps = {
  title?: string;
  message?: string;
  action?: ReactNode;
};

export default function EmptyState({
  title = "Nothing here yet",
  message = "Content will appear here when it becomes available.",
  action,
}: EmptyStateProps) {
  return (
    <StatePanel
      title={title}
      message={message}
      action={action}
      icon={
        <svg
          aria-hidden="true"
          focusable="false"
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="5" y="3" width="14" height="18" rx="3" />
          <path d="M9 3v8l3-2 3 2V3M9 15h6M9 18h4" />
        </svg>
      }
    />
  );
}
