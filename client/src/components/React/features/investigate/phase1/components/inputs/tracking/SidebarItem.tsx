import { SidebarItemData } from "@/env";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer";
import React, { useEffect, useMemo, useState } from "react";
import HasInput from "./HasInput";
import ItemText from "./ItemText";

function SidebarItem({ item }: { item: SidebarItemData }) {
    const state: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { step } = state.stepper;
    const [hasInput, setHasInput] = useState<boolean>(item.data ? true : false);
    const active = useMemo(() => {
        const isActive: boolean = (item.step - 1) === step;
        return isActive;
    }, [step, item.step])

    useEffect(() => {

        if (item.data) {
            setHasInput(true);
        } else {
            setHasInput(false)
        }

    }, [item.data])

    return (
        <li className={`transition-colors shadow-drops duration-700 ease-soft ${active ? 'bg-white/5' : 'bg-black/60'}
         w-full h-fit flex items-center overflow-hidden rounded-xl p-1 relative`}>
            <HasInput hasInput={hasInput} />
            <ItemText data={item.data} title={item.title} itemStep={item.step} />
            {item.step === 2 && <ItemText title={item.titleTwo} data={item.dataTwo} itemStep={item.step} />}
        </li>
    );
};

export default React.memo(SidebarItem);






