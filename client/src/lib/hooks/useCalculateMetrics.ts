import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { RootState, AppDispatch } from "@/state/store";
import { useEffect } from "react";
import { getMetrics } from "@/state/Reducers/Dashboard/DashboardSlice";
import MetricsCalculator from "@/lib/services/workers/metricsCalculator.js?worker";
import { MetricsPayload } from "../services/workers/metricsCalculator";

export const useCalculateMetrics = () => {
  const { investigations, articles } = useSelector(
    (s: RootState) => s.dash,
    shallowEqual,
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (investigations.status !== "ready" || articles.status !== "ready") {
      return;
    }

    let worker: Worker | undefined;
    let active = true;
    let raf = 0;

    const fail = (details: string) => {
      if (!active) return;

      active = false;
      cancelAnimationFrame(raf);

      dispatch(
        getMetrics({
          bias: { status: "failed", details },
          integrity: { status: "failed", details },
          outcomes: { status: "failed", details },
        }),
      );

      worker?.terminate();
    };

    dispatch(
      getMetrics({
        bias: { status: "pending" },
        integrity: { status: "pending" },
        outcomes: { status: "pending" },
      }),
    );

    try {
      worker = new MetricsCalculator();

      worker.onmessage = (event) => {
        const payload: MetricsPayload = event.data.chartData;

        raf = requestAnimationFrame(() => {
          if (!active) return;

          active = false;
          cancelAnimationFrame(raf);
          dispatch(
            getMetrics({
              bias: { status: "ready", data: payload.bias },
              integrity: { status: "ready", data: payload.integrity },
              outcomes: { status: "ready", data: payload.outcomes },
            }),
          );
          worker?.terminate();
        });
      };

      worker.onerror = (event) => {
        console.error("Dashboard metrics worker failed", event.message);
        fail("Failed to calculate dashboard metrics");
      };

      worker.postMessage({
        articles: articles.data,
        investigations: investigations.data,
      });
    } catch (error) {
      fail(
        error instanceof Error
          ? error.message
          : "Failed to start metrics calculation",
      );
    }

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      worker?.terminate();
    };
  }, [investigations, articles, dispatch]);
};
