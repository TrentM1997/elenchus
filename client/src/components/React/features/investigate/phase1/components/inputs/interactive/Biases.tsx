import Lottie, { LottieRefCurrentProps } from "lottie-react";
import blueCheck from "@/lotties/blueCheck.json";
import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { PerspectiveFraming } from "@/state/Reducers/Investigate/research/types";
import { BiasKind } from "../../steps/Step3";
import { PerspectiveDraft } from "@/state/Reducers/Investigate/pov/types";

interface Biases {
  research: PerspectiveDraft;
  bias: BiasKind;
  getPOV: () => void;
}

function Biases({ research, bias, getPOV }: Biases): JSX.Element | null {
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

  return (
    <div className="relative" key={bias}>
      <div
        className={`bg-white/10 lg:text-base lg:text-[0.8rem] text-xs sm:text-sm tracking-tight
                                rounded-4xl w-72 lg:w-96 lg:h-14 h-11 2xl:w-[34rem] 2xl:h-16 xl:h-14 xl:min-w-96
                                cursor-pointer md:hover:bg-white/20 md:hover:text-white transition-all duration-200 ease-soft
                                flex justify-between items-center lg:px-4 xs:px-2 grow-0 gap-3
                                ${biases === "" && "text-white"}
                                ${biases && bias === biases && "text-white bg-white/20"}
                                ${biases && bias !== biases && "text-zinc-500"}
                                `}
        data-set={bias}
        onClick={() => getPOV()}
      >
        {bias}
        <div
          className="lg:min-h-10 lg:min-w-10 lg:max-h-10 lg:p-0.5 
                  xs:max-w-7 xs:max-h-7 xs:min-w-7 xs:min-h-7 absolute xs:right-1 z-0 flex items-center justify-center"
        >
          {bias === biases ? (
            <Lottie
              onComplete={handleComplete}
              lottieRef={lottieRef}
              className="box-content absolute right-0 translate-x-0.5 xl:translate-x-1.5"
              animationData={blueCheck}
              loop={false}
              autoPlay={false}
              style={{ height: "100%", width: "100%", position: "relative" }}
            />
          ) : (
            <div className="xl:max-h-5 xl:max-w-5 xl:min-w-5 xl:min-h-5 xs:max-w-4 xs:max-h-4 xs:min-w-4 xs:min-h-4 bg-black/40 box-content rounded-full  absolute xs:right-1"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Biases);
