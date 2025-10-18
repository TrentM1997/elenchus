import { RootState } from "@/ReduxToolKit/store"
import { shallowEqual, useSelector } from "react-redux"
import SidebarItem from "../components/inputs/tracking/SidebarItem";
import { SidebarItemData } from "@/env";
import React from "react";

function PerspectiveSidebar() {
    const { idea, perspective, expertise, biases, premises } = useSelector((state: RootState) => state.investigation.pov, shallowEqual);

    const items: SidebarItemData[] = [
        { title: 'Idea', data: idea, step: 1 },
        { title: 'Perspective', data: perspective, step: 2, titleTwo: 'Prior Knowledge', dataTwo: expertise },
        { title: 'Biases', data: biases, step: 3 },
        { title: 'Premises', data: premises, step: 4 }
    ];

    return (
        <section className={`mx-auto w-full relative h-full`}>
            <main className="rounded-4xl bg-ebony/50 shadow-inset h-full w-full flex flex-col shrink-0 items-center py-4 
            md:w-80 md:h-80 xl:w-[26rem] lg:w-96 lg:h-88 xl:h-88 2xl:h-96 2xl:w-112">

                <ul className="grid grid-cols-1 items-center justify-center xl:h-[350px] lg:h-[320px] md:h-[280px] w-11/12 px-1 mx-auto">
                    {items.map((item) => (
                        <SidebarItem key={item.title} item={item} />
                    ))}
                </ul>
            </main>
        </section>
    );
};

export default React.memo(PerspectiveSidebar);