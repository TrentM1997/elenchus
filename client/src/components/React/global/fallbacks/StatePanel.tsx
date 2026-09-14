import type { ReactNode } from "react";

type StatePanelProps = {
  title: string;
  message: string;
  icon: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "error";
  role?: "status" | "alert";
};

export default function StatePanel({
  title,
  message,
  icon,
  action,
  tone = "neutral",
  role = "status",
}: StatePanelProps) {
  return (
    <div className="flex w-full min-w-0 items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
      <section className="relative isolate w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-ebony/40 px-6 py-10 text-center sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradientdown opacity-20"
        />
        <div
          aria-hidden="true"
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${
            tone === "error"
              ? "border-rose-300/20 bg-rose-400/10 text-rose-200"
              : "border-blue-300/20 bg-blue-400/10 text-blue-200"
          }`}
        >
          {icon}
        </div>
        <div role={role} aria-atomic="true" className="space-y-3">
          <h2 className="break-words text-2xl font-medium tracking-tight text-white">
            {title}
          </h2>
          <p className="mx-auto max-w-sm break-words text-sm leading-relaxed text-zinc-300 sm:text-base">
            {message}
          </p>
        </div>
        {action != null && (
          <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div>
        )}
      </section>
    </div>
  );
}
