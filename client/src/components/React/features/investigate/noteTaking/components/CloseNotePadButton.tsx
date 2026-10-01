import { openOrCloseNotePad } from "@/state/Reducers/Investigate/articles/NoteTaking";
import { AppDispatch } from "@/state/store";
import { useDispatch } from "react-redux";

export default function CloseNotePadButton() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      onClick={() => dispatch(openOrCloseNotePad({ status: "closed" }))}
      className="max-w-8 max-h-8 p-1.5 box-border hover:bg-white/20 transition-all duration-200 ease-in-out"
    >
      <svg
        className="text-white"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="100%"
        height="100%"
      >
        <path
          d="M 7 22 A 2.0002 2.0002 0 1 0 7 26 L 41 26 A 2.0002 2.0002 0 1 0 41 22 L 7 22 z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
