import type { SaveInvestigationState } from "@/state/Reducers/Investigate/research/types";

export default function SaveInvestigation({
  status,
  handleSave,
}: {
  status: SaveInvestigationState["status"];
  handleSave: () => Promise<void>;
}) {
  return (
    <button
      disabled={status === "pending"}
      onClick={handleSave}
      className={`bg-white w-auto 2xl:w-60 hover:bg-white/10 group shadow-thick 
                    transition-all duration-200 ease-in-out rounded-full h-fit py-2 px-4 mx-auto flex items-center`}
    >
      <p
        className={`${status === "ready" ? "text-slate-500" : "text-black"} transition-all duration-200 ease-in-out
             w-full text-xs 2xl:text-lg text-nowrap group-hover:text-white font-light text-center`}
      >
        Save your research <span className="ml-2">&#8594;</span>
      </p>
    </button>
  );
}
