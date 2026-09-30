import React, { useEffect, useCallback, useMemo, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

interface PerspectiveLottiePlayState {
  perspective: string | null;
  opinion: string | null;
}

export const usePerspectiveLottiePlayState = ({
  perspective,
  opinion,
}: PerspectiveLottiePlayState) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const chosen = useMemo(() => {
    if (perspective === null) return false;
    const isChosen: boolean = opinion === perspective;
    return isChosen;
  }, [opinion, perspective]);

  const hasPlayedBefore = useMemo(() => {
    if (!chosen) return false;
    try {
      const lastPlayed = sessionStorage.getItem("previous-perspective");
      return lastPlayed === opinion;
    } catch {
      return false;
    }
  }, [chosen]);

  const jumpToEnd = useCallback(() => {
    const api = lottieRef.current;
    if (!api) return;
    const lastFrame = api.getDuration(true);
    if (!lastFrame) return;
    api.goToAndStop(Math.max(0, lastFrame), true);
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
    if (!chosen || !perspective) return;
    try {
      sessionStorage.setItem("previous-perspective", perspective);
    } catch {}
    jumpToEnd();
  }, [chosen, jumpToEnd, perspective]);

  return {
    handleComplete,
    lottieRef,
  };
};
