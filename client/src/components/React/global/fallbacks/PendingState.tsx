import StatePanel from "./StatePanel";

export type PendingStateProps = {
  title?: string;
  message?: string;
};

export default function PendingState({
  title = "Loading your content",
  message = "Just a moment while we get everything ready.",
}: PendingStateProps) {
  return (
    <StatePanel
      title={title}
      message={message}
      icon={
        <svg
          focusable="false"
          className="h-8 w-8 motion-safe:animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="12" cy="12" r="9" className="opacity-20" />
          <path d="M12 3a9 9 0 0 1 9 9" strokeLinecap="round" />
        </svg>
      }
    />
  );
}
