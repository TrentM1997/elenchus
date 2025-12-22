import { RootState } from "@/state/store";
import React from "react";
import { useSelector } from "react-redux";
import { limitString } from "@/helpers/Presentation";

function ItemText({ title, data, itemStep }): JSX.Element | null {
    const step = useSelector((state: RootState) => state.investigation.stepper.step);
    const formatted: string = (data) && (data.length > 50)
        ? limitString(data, 100)
        : data || "";


    return (
        <div className={`${itemStep === 2 ? 'w-full items-center' : 'basis-full'} 2xl:h-[68px] xl:h-[68px] lg:h-[64px] md:h-[54px] flex flex-col gap-y-2`}>
            <div className={`
                transition-all duration-200 ease-in-out overflow-hidden p-0.5
                `}
            >

                <p className={` ${step === (itemStep - 1)
                    ? 'text-blue-400'
                    : 'text-blue-400'
                    } 
                    ${itemStep === 2 ? 'text-center' : 'text-center'}
                 md:text-sm xl:text-base tracking-tight`}>
                    {title}
                </p>
                <p className={`${itemStep === 2 ? 'text-center' : 'text-center'}
                ${`${formatted ? 'text-white/80' : 'text-zinc-500'}`}
                  font-light tracking-tight md:text-xs xl:text-sm`}>
                    {data
                        ? formatted
                        : 'awaiting input'}
                </p>
            </div>
        </div>
    );
};

export default React.memo(ItemText);