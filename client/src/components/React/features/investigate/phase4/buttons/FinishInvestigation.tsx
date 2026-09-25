import { useDispatch } from "react-redux";
import { completeResearch } from "@/state/Reducers/Investigate/research/ResearchSlice";

export default function EndInvestigateButton() {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => {
        dispatch(completeResearch());
      }}
      className="w-auto bg-white hover:bg-white/10 group shadow-thick mt-3
            transition-colors duration-200 ease-in-out rounded-full h-fit py-2 px-8 mx-auto flex items-center"
    >
      <p className="text-black text-xs md:text-lg group-hover:text-white font-light text-center">
        Finished <span className="ml-2">&#8594;</span>
      </p>
    </button>
  );
}
