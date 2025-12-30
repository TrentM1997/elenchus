import { useDispatch, useSelector } from "react-redux"
import { getPopoverPost, selectPost } from "@/state/Reducers/BlueSky/BlueSkySlice"
import { getIdea } from "@/state/Reducers/Investigate/UserPOV"
import { useEffect } from "react";
import { changePhase } from "@/state/Reducers/Investigate/Rendering";
import { smoothScrollUp } from "@/lib/helpers/scroll/ScrollToTop";
import { wait } from "@/lib/helpers/formatting/Presentation";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { RootState } from "@/state/store";

interface UseThis {
    post: any,
    shouldRedirect?: boolean
};

export default function UseThisPost({ post, shouldRedirect }: UseThis) {
    const selected: string = useSelector((s: RootState) => s.bluesky.selected);
    const dispatch = useDispatch();

    const investigateThis = async () => {
        dispatch(getIdea(post.record.text));
        dispatch(renderModal(null));
        smoothScrollUp();
        await wait(400);
        if (shouldRedirect) {
            await wait(400)
            dispatch(changePhase('Phase 1'));
        } else {
            await wait(300);
            dispatch(changePhase('Phase 1'));
        };
    };

    const unselect = async () => {
        dispatch(renderModal(null));
    };


    useEffect(() => {

        return () => {
            dispatch(selectPost(null));
            dispatch(getPopoverPost(null));
        }
    }, [])

    return (
        <div key={post.record.createdAt} className="bg-transparent relative h-auto w-auto flex justify-center items-center gap-x-8 rounded-3xl
        lg:col-span-2 lg:flex-row lg:items-center
        text-center">
            <div className="lg:min-w-0 lg:flex-1 max-w-sm mx-auto flex justify-center items-center">

                <div
                    className="inline-flex flex-no-wrap gap-x-4 items-center mt-8 w-full"
                >
                    <button
                        aria-label="confirm post to investigate"
                        onClick={investigateThis}
                        type="button"
                        className="text-lg font-light py-2 w-32 px-4 border focus:ring-2 rounded-full border-transparent
                     bg-white lg:hover:bg-blue-500 text-black focus:ring-offset-2 focus:ring-white 
                     hover:text-white inline-flex items-center justify-center ring-1 ring-transparent 
                     transition-all duration-200 ease-in-out"
                    >
                        Yes
                    </button>
                    <button
                        aria-label="unselect BlueSky post"
                        onClick={unselect}
                        type="button"
                        className="text-lg font-light py-2 w-32 px-4 border focus:ring-2 rounded-full border-transparent
                     bg-white lg:hover:bg-mirage text-black focus:ring-offset-2 focus:ring-white 
                     hover:text-white inline-flex items-center justify-center ring-1 ring-transparent
                     transition-all duration-200 ease-in-out"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};