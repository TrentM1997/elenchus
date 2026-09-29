const shimmer =
  "bg-[length:200%_100%] bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] motion-safe:animate-shimmer";

export default function DetailsTableSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading investigation details"
      className="w-full 2xl:max-w-7xl xl:max-w-5xl lg:max-w-4xl md:max-w-3xl max-w-2xl"
    >
      <div
        aria-hidden="true"
        className="mx-auto 2xl:max-w-7xl lg:py-12 lg:px-0 2xl:py-0 px-2 items-center relative w-full"
      >
        <div className="relative isolate lg:flex-col overflow-hidden bg-gradientdown rounded-4xl px-6 p-10 lg:flex lg:p-20">
          <div className="pb-12 border-b border-white/10">
            <div className="flex h-6 items-center">
              <div className={`${shimmer} h-4 w-40 rounded`} />
            </div>
            <div className="mt-6">
              <div className="flex h-9 lg:h-10 items-center">
                <div className={`${shimmer} h-7 lg:h-9 w-96 max-w-full rounded`} />
              </div>
              <div className="flex h-9 lg:h-10 items-center">
                <div className={`${shimmer} h-7 lg:h-9 w-80 max-w-full rounded`} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 mt-12 md:grid-cols-3 lg:space-y-0 lg:gap-24">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index}>
                <div className="flex items-center gap-3">
                  <div className={`${shimmer} size-6 shrink-0 rounded`} />
                  <div className={`${shimmer} h-4 w-32 max-w-full rounded`} />
                </div>
                <div className="mt-4 space-y-2">
                  <div className={`${shimmer} h-3 w-full rounded`} />
                  <div className={`${shimmer} h-3 w-full rounded`} />
                  <div className={`${shimmer} h-3 w-3/4 rounded`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
