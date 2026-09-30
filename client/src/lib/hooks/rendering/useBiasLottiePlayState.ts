import { LottieRefCurrentProps } from "lottie-react";
import { useEffect, useCallback, useMemo, useRef } from "react";
import { PerspectiveDraft } from "@/state/Reducers/Investigate/pov/types";
import { BiasKind } from "@/components/React/features/investigate/phase1/components/steps/Step3";

export const useBiasLottiePlayState = (
  research: PerspectiveDraft,
  bias: BiasKind,
) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const { biases } = research;

  const chosen = useMemo(() => {
    if (biases === null) return false;
    const isChosen: boolean = bias === biases;
    return isChosen;
  }, [bias, biases]);

  const hasPlayedBefore = useMemo(() => {
    if (!chosen) return false;
    try {
      const lastPlayed = sessionStorage.getItem("previous-biases");
      return lastPlayed === bias;
    } catch {
      return false;
    }
  }, [chosen]);

  const jumpToEnd = useCallback(() => {
    const api = lottieRef.current;
    if (!api) return;
    const lastFrame = api.getDuration(true);
    if (lastFrame) {
      api.goToAndStop(Math.max(0, lastFrame), true);
    }
  }, []);

  useEffect(() => {
    const lottieApi = lottieRef.current;
    if (!lottieApi) return;

    if (!chosen) {
      lottieApi.goToAndStop(0, true);
      return;
    }

    if (hasPlayedBefore) {
      jumpToEnd();
    } else {
      lottieApi.play();
    }
  }, [hasPlayedBefore]);

  const handleComplete = useCallback(() => {
    if (!chosen) return;
    try {
      sessionStorage.setItem("previous-biases", bias);
    } catch {}
    jumpToEnd();
  }, [chosen, jumpToEnd]);

  return {
    lottieRef,
    handleComplete,
  };
};
