import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import type { ActiveTab } from "@/ReduxToolKit/Reducers/UserContent/DashboardTabs";
import renderTab from "../../switches/renderTab";


export default function Display() {
    const tab: ActiveTab = useSelector((s: RootState) => s.dashboard.tab);

    return (
        <main
            className="opacity-0  animate-fade-in animation-delay-300ms
            w-full relative h-full min-h-dvh px-4 
            md:px-6 lg:px-0 mx-auto flex items-start justify-center pb-16"
        >
            <div className="absolute inset-0">

                {renderTab(tab)}
            </div>
        </main>
    );
};