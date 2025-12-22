import { changePhase } from "@/state/Reducers/Investigate/Rendering";
import { resetResults } from "@/state/Reducers/Investigate/SearchResults";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { useDispatch } from "react-redux"

export default function BackToSearch(): JSX.Element {
    const dispatch = useDispatch();
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    const returnToSearch = async () => {
        dispatch(resetResults());
        await wait(200);
        dispatch(changePhase('Phase 2'))
        await wait(100);
        dispatch(renderModal(null));
    };

    return (
        <div className="z-50 opacity-0 animate-fade-blur animation-delay-400ms transform-gpu will-change-transform
                     xl:min-w-96 xl:min-h-80 w-auto h-auto flex flex-col items-start gap-x-8 gap-y-6 rounded-3xl p-8 
                    sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center   bg-rich_black ring-2 ring-white/20 mt-2   backdrop-blur-xl
                       shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_30px_60px_-10px_rgba(0,0,0,0.85)] text-center">
            <div className="lg:min-w-0 lg:flex-1 w-full mx-auto">
                <p className="text-white xl:text-3xl font-light tracking-tight">Are you sure?</p>
                <p className="mt-4">
                    <span className="text-2xl font-lighter text-white" />
                    <span className="text-base font-medium text-zinc-400/80">You will lose the articles you just loaded.</span><br></br>
                    <span className="text-base font-medium text-zinc-400/80">This action cannot be undone</span>
                </p>
                <p className="mx-auto mt-6 text-sm text-white" />
                <div className="inline-flex flex-no-wrap gap-x-4 items-center mt-8 w-full">

                    <button onClick={() => { dispatch(renderModal(null)) }} type="button" className="text-base min-w-36 py-2 w-full px-4 border focus:ring-2 rounded-full border-transparent bg-white hover:bg-white/10 text-black duration-200 focus:ring-offset-2 focus:ring-white hover:text-white inline-flex items-center justify-center ring-1 ring-transparent">
                        No
                    </button>
                    <button onClick={returnToSearch} type="button" className="text-base py-2 min-w-36 w-full px-4 border focus:ring-2 rounded-full border-transparent bg-white hover:bg-white/10 text-black duration-200 focus:ring-offset-2 focus:ring-white hover:text-white inline-flex items-center justify-center ring-1 ring-transparent">
                        Yes
                    </button>
                </div>
            </div>
        </div>
    )
};