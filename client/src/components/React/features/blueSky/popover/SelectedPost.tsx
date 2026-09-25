import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import BSPost from "../Components/Post/BSPost";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export default function SelectedPost(): JSX.Element | null {
  const selected = useSelector((state: RootState) => state.bluesky.selected);

  switch (selected.status) {
    case "initial": {
      return null;
    }
    case "ready": {
      return (
        <div
          className="relative 2xl:w-[26rem] md:w-96 w-80 h-fit 
    opacity-0 animate-fade-in animation-delay-400ms ease-soft"
        >
          <BSPost inPopover={true} post={selected.data} />
        </div>
      );
    }

    default: {
      return assertNever(selected);
    }
  }
}
