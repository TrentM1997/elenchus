import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";

export type Priority = "complete" | "pending" | "failed";

interface RenderMetrics {
  priority1: Priority;
  priority2: Priority;
  priority3: Priority;
}

interface RenderValues {
  priority1: Priority;
  priority2: Priority;
  priority3: Priority;
}

export function useRenderMetrics(): RenderValues {
  const articles = useSelector((state: RootState) => state.dash.articles);
  const biasRatings = useSelector((state: RootState) =>
    state.dash.metrics.bias.status === "ready"
      ? state.dash.metrics.bias.data
      : null,
  );
  const ratingData = useSelector((state: RootState) =>
    state.dash.metrics.integrity.status === "ready"
      ? state.dash.metrics.integrity.data
      : null,
  );
  const [priority, setPriority] = useState<RenderMetrics>({
    priority1: "pending",
    priority2: "pending",
    priority3: "pending",
  });

  useEffect(() => {
    if (articles.status !== "ready") return;
    if (priority.priority1 === "failed" || priority.priority2 === "failed") {
      setPriority((prev: RenderMetrics) => ({
        ...prev,
        priority1: "failed",
        priority2: "failed",
      }));
      return;
    }
    const priority_one_curr = priority.priority1;
    const priority_two_curr = priority.priority2;
    const upstreamDone =
      priority_one_curr === "complete" && priority_two_curr === "complete";
    if (upstreamDone) return;

    const biasLoaded = Array.isArray(biasRatings) && biasRatings.length > 0;
    if (biasLoaded && priority.priority1 !== "complete") {
      setPriority((prev: RenderMetrics) => ({
        ...prev,
        priority1: "complete",
      }));
    }
    const upstream = priority.priority1;
    const batchReady =
      Array.isArray(ratingData) &&
      ratingData.length > 0 &&
      upstream === "complete";
    if (batchReady && priority.priority2 !== "complete") {
      setPriority((prev: RenderMetrics) => ({
        ...prev,
        priority2: "complete",
      }));
    }
  }, [ratingData, biasRatings, articles, priority, priority]);

  useEffect(() => {
    if (priority.priority3 === "failed") return;
    const priority_three_curr = priority.priority3;

    if (priority_three_curr === "complete") return;

    const priority_one_curr = priority.priority1;
    const priority_two_curr = priority.priority2;
    const upstream_complete =
      priority_one_curr === "complete" && priority_two_curr === "complete";
    if (upstream_complete) {
      setPriority((prev: RenderMetrics) => ({
        ...prev,
        priority3: "complete",
      }));
    }
  }, [priority]);

  return {
    priority1: priority.priority1,
    priority2: priority.priority2,
    priority3: priority.priority3,
  };
}
