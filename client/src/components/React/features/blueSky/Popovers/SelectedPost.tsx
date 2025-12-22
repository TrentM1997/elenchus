import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import BSPost from "../Components/Post/BSPost";

export default function SelectedPost(): JSX.Element {
    const popoverPost = useSelector((state: RootState) => state.bluesky.popoverPost);

    return (
        <div className="relative 2xl:w-[26rem] md:w-96 w-80 h-fit opacity-0 animate-fade-in animation-delay-850ms ease-soft">
            <BSPost inPopover={true} post={popoverPost} />
        </div>
    )
}