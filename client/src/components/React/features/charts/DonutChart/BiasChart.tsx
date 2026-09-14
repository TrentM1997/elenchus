import ChartHeader from "./ChartHeader";
import SourceChart from "./SourceChart";
import React from "react";

function BiasChart({ biasRatings }: { biasRatings: number[] }): JSX.Element {
  return (
    <section className="lg:p-8 opacity-0 max-w-7xl animate-fade-blur ease-soft animation-delay-200ms">
      <div className="mx-auto 2xl:max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 pt-8 xl:pt-0 lg:gap-24 items-center">
          <ChartHeader />
          <SourceChart biasRatings={biasRatings} />
        </div>
      </div>
    </section>
  );
}

export default React.memo(BiasChart);
