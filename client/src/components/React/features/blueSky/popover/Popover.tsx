import SelectedPost from "./SelectedPost";
import UseThisPost from "./UseThisPost";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";

export default function Popover(): JSX.Element | null {
  const selected = useSelector((state: RootState) => state.bluesky.selected);

  if (selected.status !== "ready") return null;

  return (
    <div
      className=" relative bg-black ring-2 ring-white/15
       h-fit w-88 sm:w-auto p-4 sm:p-8 rounded-3xl shadow-material z-[910]
      flex flex-col justify-center  items-center
      "
    >
      <header className="w-full h-auto">
        <h1 className="text-white font-light tracking-tight text-lg lg:text-xl xl:text-2xl text-center">
          Investigate this?
        </h1>
      </header>
      <SelectedPost />
      <UseThisPost post={selected.data} />
    </div>
  );
}
