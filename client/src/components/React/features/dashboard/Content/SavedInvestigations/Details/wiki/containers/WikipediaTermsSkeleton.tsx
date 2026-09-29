const shimmer =
  "bg-[length:200%_100%] bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] motion-safe:animate-shimmer";

export default function WikipediaTermsSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading Wikipedia terms"
      className="w-full lg:max-w-5xl xl:max-w-5xl 2xl:max-w-7xl"
    >
      <div aria-hidden="true" className="mx-auto py-12 px-4 items-center w-full">
        <div className="flex h-6 items-center">
          <div className={`${shimmer} h-4 w-32 rounded`} />
        </div>
        <div className="mt-6 space-y-2">
          <div className={`${shimmer} h-7 lg:h-9 w-64 max-w-full rounded`} />
          <div className={`${shimmer} h-7 lg:h-9 w-80 max-w-full rounded`} />
        </div>
        <div className="mt-4 max-w-md space-y-2 py-1">
          <div className={`${shimmer} h-4 w-full rounded`} />
          <div className={`${shimmer} h-4 w-4/5 rounded`} />
        </div>

        <div className="flex flex-col w-full gap-y-4 2xl:gap-y-12">
          <div className="pb-6 border-b border-white/10" />
          <div className="w-full 2xl:max-w-full xl:max-w-5xl lg:max-w-5xl md:max-w-3xl overflow-hidden">
            <ul className="flex flex-wrap gap-1 sm:gap-2 lg:gap-3 lg:flex-nowrap">
              {Array.from({ length: 4 }, (_, index) => (
                <li
                  key={index}
                  className="w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-3rem)/4)] bg-ebony shadow-inset rounded-3xl p-4 grow-0 shrink-0"
                >
                  <div className="pb-4">
                    <div className={`${shimmer} size-4 rounded-full`} />
                    <div className="mt-6 flex h-6 items-center">
                      <div className={`${shimmer} h-4 w-3/4 rounded`} />
                    </div>
                    <div className="h-52 w-full border-b border-white/20 mt-4 pt-2 space-y-2">
                      {Array.from({ length: 7 }, (_, line) => (
                        <div
                          key={line}
                          className={`${shimmer} h-3 2xl:h-3.5 rounded ${line === 6 ? "w-2/3" : "w-full"}`}
                        />
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
