const shimmer =
  "bg-[length:200%_100%] bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] motion-safe:animate-shimmer";

export default function ResearchSourceSkeleton(): JSX.Element {
  return (
    <li
      aria-hidden="true"
      className="mx-auto w-full xl:px-12 md:max-w-4xl lg:max-w-6xl xl:max-w-7xl opacity-90"
    >
      <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-x-2 xl:gap-24 items-center">
        <div className="w-full min-w-0 md:flex-1">
          <div className="mt-6 space-y-2">
            <div
              className={`${shimmer} h-7 md:h-5 lg:h-6 xl:h-7 2xl:h-9 w-full rounded`}
            />
            <div
              className={`${shimmer} h-7 md:h-5 lg:h-6 xl:h-7 2xl:h-9 w-4/5 rounded`}
            />
          </div>
          <div className="mt-6 flex gap-2">
            <div className={`${shimmer} h-3 w-1/3 rounded`} />
            <div className={`${shimmer} h-3 w-1/4 rounded`} />
          </div>
          <div className={`${shimmer} mt-6 h-3 w-1/2 rounded`} />
        </div>
        <div
          className={`${shimmer} aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/2] w-88 max-w-full md:w-1/2 xl:w-[25rem] shrink-0 rounded-3xl`}
        />
      </div>
    </li>
  );
}
