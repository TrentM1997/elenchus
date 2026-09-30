import { selectWizardStepIndex } from "@/state/Reducers/Investigate/pov/selectors";
import { SidebarItemData } from "@/env";
import { useSelector } from "react-redux";
import React from "react";
import HasInput from "./HasInput";
import ItemText from "./ItemText";

function SidebarItem({ item }: { item: SidebarItemData }) {
  const step = useSelector(selectWizardStepIndex);

  return (
    <li
      className={`transition-colors shadow-drops duration-700 ease-soft ${item.step - 1 === step ? "bg-white/5" : "bg-black/60"}
         w-full h-fit flex items-center overflow-hidden rounded-xl p-1 relative`}
    >
      <HasInput hasInput={item.data !== null} />
      <ItemText data={item.data} title={item.title} itemStep={item.step} />
      {item.step === 2 && (
        <ItemText
          title={item.titleTwo}
          data={item.dataTwo}
          itemStep={item.step}
        />
      )}
    </li>
  );
}

export default React.memo(SidebarItem);
