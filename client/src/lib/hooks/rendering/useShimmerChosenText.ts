import { SelectedArticles } from "@/state/Reducers/Investigate/articles/ChosenArticles";
import { useEffect, useRef, useState } from "react";

export const useShimmerChosenText = ({
  chosenArticles,
}: {
  chosenArticles: SelectedArticles;
}) => {
  const selectedTotal =
    chosenArticles.status === "empty" ? 0 : chosenArticles.data.length;
  const message = `${selectedTotal}/3`;
  const [phase, setPhase] = useState<"idle" | "shimmer" | "fadeout">("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (selectedTotal === 3) {
      setPhase("shimmer");
      timerRef.current = window.setTimeout(() => setPhase("fadeout"), 6000);
      return () => clearTimeout(timerRef.current!);
    }
    setPhase("idle");

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [selectedTotal]);

  return {
    message,
    phase,
  };
};
