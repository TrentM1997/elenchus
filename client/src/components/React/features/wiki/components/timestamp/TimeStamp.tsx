import { WikiResponseSchemaType } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";
import { useMemo } from "react";

interface TimeStamp {
  disambig: Extract<WikiResponseSchemaType, { kind: "disambiguation" }> | null;
  summary: Extract<WikiResponseSchemaType, { kind: "summary" }> | null;
}

export default function TimeStamp({
  disambig,
  summary,
}: TimeStamp): JSX.Element | null {
  if (!disambig && !summary) return null;

  const lastChanged = useMemo((): string[] | null => {
    let timestamp: string[] | null;
    if (summary) {
      timestamp = summary?.lastUpdated
        ? summary.lastUpdated.split("").slice(0, 10)
        : null;
    } else {
      timestamp = disambig?.lastUpdated
        ? disambig.lastUpdated.split("").slice(0, 10)
        : null;
    }
    return timestamp;
  }, [disambig, summary]);

  return (
    <div
      className={`
                text-zinc-400 text-xs font-light leading-5 tracking-tight
                `}
    >
      Last Updated:{" "}
      <span className="text-zinc-300">{lastChanged ? lastChanged : null}</span>
    </div>
  );
}
