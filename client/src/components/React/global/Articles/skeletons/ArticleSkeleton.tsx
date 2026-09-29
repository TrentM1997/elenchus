import { motion } from "framer-motion";
import { variants } from "@/motion/variants";

export default function ArticleSkeleton() {
  return (
    <motion.div
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.2 }}
      role="status"
      aria-label="Loading article"
      className="relative flex grow flex-col mx-auto w-full lg:max-w-2xl xl:max-w-5xl min-h-screen bg-black"
    >
      <div aria-hidden="true">
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.025] p-4 sm:p-6">
          <div className="motion-safe:animate-pulse">
            <div className="grid items-center gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-8">
              <div className="aspect-[16/10] w-full rounded-2xl bg-white/10 ring-1 ring-inset ring-white/10" />
              <div className="flex min-w-0 flex-col items-start gap-4 sm:gap-5">
                <div className="flex w-full min-w-0 items-center gap-2.5">
                  <div className="h-9 w-9 shrink-0 rounded-full border border-white/10 bg-white/10" />
                  <div className="h-3.5 w-32 max-w-[65%] rounded bg-white/10" />
                </div>
                <div className="w-full">
                  {["w-full", "w-4/5"].map((width) => (
                    <div key={width} className="flex h-7 items-center sm:h-8 xl:h-10">
                      <div className={`h-5 ${width} rounded bg-white/10 sm:h-6 xl:h-7`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 sm:mt-6">
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {["published", "bias"].map((field) => (
                  <div key={field} className="space-y-2">
                    <div className="h-3 w-16 rounded bg-white/5" />
                    <div className="h-3.5 w-28 rounded bg-white/10" />
                  </div>
                ))}
              </div>
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04]" />
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04]" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 tracking-tight">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] px-4 py-6 sm:p-6 md:p-6">
            <div className="mx-auto w-full min-w-0 max-w-[80ch] motion-safe:animate-pulse">
              <div className="mb-6 space-y-2">
                <div className="h-6 w-11/12 rounded bg-white/10" />
                <div className="h-6 w-1/3 rounded bg-white/10" />
              </div>
              {["w-5/6", "w-3/4", "w-2/3", "w-4/5"].map((lastLine, index) => (
                <div key={lastLine} className={index === 0 ? "" : "mt-5"}>
                  {["w-full", "w-full", lastLine].map((width, line) => (
                    <div key={line} className="flex h-7 items-center">
                      <div className={`h-3.5 ${width} rounded bg-white/5`} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
