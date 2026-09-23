import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import type { DashboardTab } from "@/state/Reducers/Dashboard/types";
import RenderTab from "../../switches/RenderDasbhoardTab";

export default function Display() {
  const tab: DashboardTab = useSelector((s: RootState) => s.dash.tab);

  return (
    <main
      className="opacity-0  animate-fade-in animation-delay-300ms
            w-full relative h-full min-h-dvh px-4 
            md:px-6 lg:px-0 mx-auto flex items-start justify-center pb-16"
    >
      <div className="absolute inset-0">
        <RenderTab tab={tab} />
      </div>
    </main>
  );
}
