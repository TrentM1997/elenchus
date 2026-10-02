import { showFeedbackForm } from "@/state/Reducers/Feedback/FeedbackSlice";
import { renderModal } from "@/state/Reducers/Overlay/PipelineSlice";
import { AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";

export default function FeedbackOptIn() {
  const dispatch = useDispatch<AppDispatch>();

  const optIn = () => {
    dispatch(showFeedbackForm());
    dispatch(renderModal("Feedback Form"));
  };

  return (
    <button
      onClick={() => optIn()}
      className={`bg-white w-auto 2xl:w-60 hover:bg-white/10 group shadow-thick 
                            transition-all duration-200 ease-in-out rounded-full h-fit py-2 px-4 mx-auto flex items-center`}
    >
      <p
        className={`text-black transition-all duration-200 ease-in-out
                     w-full text-xs 2xl:text-lg text-nowrap group-hover:text-white font-light text-center`}
      >
        Share Feedback
      </p>
    </button>
  );
}
