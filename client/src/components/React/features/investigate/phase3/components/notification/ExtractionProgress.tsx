import { Prog } from "@/state/Reducers/Investigate/articles/types";

export default function ExtractionProgress({ progress }: { progress: Prog }) {
  return (
    <div key="titleContainer" className="w-auto h-fit">
      <p className="text-white text-sm flex items-center gap-x-2.5">
        <span className="text-white/70">extraction progress </span>{" "}
        <span className="">{`[${progress}]`}</span>
      </p>
    </div>
  );
}
