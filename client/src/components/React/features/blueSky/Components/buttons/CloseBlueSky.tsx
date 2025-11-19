import { useDispatch } from "react-redux";
import { AppDispatch } from "@/ReduxToolKit/store";
import { changePhase, choosePath } from "@/ReduxToolKit/Reducers/Investigate/Rendering";
import { wait } from "@/helpers/Presentation";

export default function CloseBlueSky() {
    const dispatch = useDispatch<AppDispatch>();

    const handleClose = async () => {
        dispatch(choosePath('Path Chosen'));
        await wait(300);
        dispatch(changePhase("Phase 1"));
    };

    return (
        <div onClick={() => dispatch(changePhase('Phase 1'))}
            className="absolute top-1.5 right-1.5 z-50 max-h-8 max-w-8 p-1 
                  cursor-pointer rounded-full hover:bg-white/20 transition-all 
                  duration-200 ease-in-out"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width={'100%'}
                height={'100%'} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                className="icon icon-tabler text-white icons-tabler-outline icon-tabler-x"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
            </svg>
        </div>
    );
};