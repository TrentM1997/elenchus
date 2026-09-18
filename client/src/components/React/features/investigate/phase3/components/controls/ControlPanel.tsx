import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { motion } from "framer-motion";
import type { JSX } from "react";
import { controlPanelCSS, motionprops } from "./styles";
import ControlPanelButtons from "./ControlPanelButtons";

export default function ControlPanel(): JSX.Element | null {
  const { articles } = useSelector(
    (state: RootState) => state.investigation.read,
  );

  return (
    <motion.div {...motionprops} className={controlPanelCSS}>
      <ControlPanelButtons status={articles.status} />
    </motion.div>
  );
}
