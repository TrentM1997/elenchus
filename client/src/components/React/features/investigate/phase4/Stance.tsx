import StepsEditor from "../../../Shared/TipTap/StepsEditor"
import EndInvestigateButton from "./buttons/FinishInvestigation"
import { getTakeAways } from "@/ReduxToolKit/Reducers/Investigate/Review"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import { SetStateAction, useEffect, useState } from "react";
import type { AppDispatch } from "@/ReduxToolKit/store"
import { changePhase } from "@/ReduxToolKit/Reducers/Investigate/Rendering"

type Opt = 'initial' | 'Opt-in' | 'Opt-out';

export default function Stance() {
    const takeAway = useSelector((state: RootState) => state.investigation.review.takeAway);
    const newPOV = useSelector((state: RootState) => state.investigation.review.newPOV);
    const [option, setOption] = useState<Opt>('initial');
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (option === 'initial') return;

        if (option === 'Opt-out') {
            dispatch(changePhase('Phase 5'));
        };
    }, [option, dispatch]);


    return (
        <section
            className="w-full h-full xs:px-6 flex flex-col gap-y-1 items-center content-center mx-auto">
            {(option === 'initial') && <OptionFortakeaway key={'options'} setOption={setOption} />}
            {(option === 'Opt-in') && <OptionalTakeaway key={'input-takeaway'} getTakeAways={getTakeAways} newPOV={newPOV} takeAway={takeAway} />}
            {(option === 'Opt-in') && <EndInvestigateButton key={'endbutton'} />}
        </section>
    )
};


interface OptionalTakeawayProps {
    newPOV: any,
    takeAway: string | null,
    getTakeAways: any
}

function OptionalTakeaway({ newPOV, takeAway, getTakeAways }: OptionalTakeawayProps): JSX.Element | null {

    return (
        <>
            <header className="xs:w-full border-b border-white/10 md:mb-2 flex justify-start">
                <div className="w-full h-auto">
                    <h1 className="text-sm w-full lg:text-lg lg:mb-2 2xl:text-xl text-white font-light tracking-tight">
                        {newPOV ? 'So you changed your stance, what moved you?' : 'What validated your initial thoughts?'}
                    </h1>
                </div>
            </header>
            <main className="xs:w-full xs:h-auto mx-auto mb-4">
                <div className="w-full xs:h-32 sm:h-36 xl:h-44 2xl:h-52 bg-white/10 rounded-lg">
                    <StepsEditor id="takeaway" context={takeAway} setterFunction={getTakeAways} />
                </div>
            </main>
        </>
    )
};


interface OptionButtons {
    setOption: React.Dispatch<SetStateAction<string>>
};

function OptionFortakeaway({ setOption }: OptionButtons): JSX.Element | null {


    return (
        <div className="w-full h-full flex flex-col justify-start items-center gap-8">
            <header className="w-auto h-auto">
                <h1 className="text-white font-light w-full tracking-tight text-sm 2xl:text-lg ">
                    Want to write down any takeways?
                </h1>
            </header>
            <div
                className="w-auto flex items-center gap-x-2">
                <button onClick={() => setOption("Opt-in")} className="flex items-center relative px-2 text-black hover:text-white
                 xs:w-28 xs:h-9 lg:w-32 lg:h-12 2xl:p-2 2xl:h-12 2xl:w-36 cursor-pointer bg-white hover:bg-white/5 
                rounded-lg transition-all duration-200 ease-inout group text-center
                 ">
                    Yes
                </button>
                <button onClick={() => setOption("Opt-out")} className="flex items-center relative px-2 text-black hover:text-white
                 xs:w-28 xs:h-9 lg:w-32 lg:h-12 2xl:p-2 2xl:h-12 2xl:w-36 cursor-pointer bg-white hover:bg-white/5 
                rounded-lg transition-all duration-200 ease-inout group text-center
                 ">
                    No
                </button>
            </div>
        </div>
    )
}