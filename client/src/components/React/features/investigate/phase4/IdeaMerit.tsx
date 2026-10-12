import { motion } from "framer-motion";
import { updateReflection } from "@/state/Reducers/Investigate/research/ResearchSlice";
import ChecksButton from "./buttons/ChecksButton";
import {
  ResearchReflection,
  UserResearchType,
} from "@/state/Reducers/Investigate/research/types";

const questions = [
  "Did the evidence support the idea?",
  "Has your perspective changed?",
  "What is your perspective now?",
];

export default function IdeaMerit({
  research,
}: {
  research: Extract<
    UserResearchType,
    { phase: "reflection" } | { phase: "completed" }
  >;
}) {
  const data = research.data.reflection;
  const { had_merit: merit, changed_opinion: movedOnIdea } = data;
  const getMerit = (had_merit: ResearchReflection["had_merit"]) =>
    updateReflection({ ...data, had_merit });
  const moved = (changed_opinion: ResearchReflection["changed_opinion"]) =>
    updateReflection({ ...data, changed_opinion });

  return (
    <motion.div
      layout
      key={"reflection"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", duration: 0.2 }}
      className="w-full h-auto flex flex-col gap-y-6 justify-center items-center"
    >
      <div className="flex flex-col gap-y-2 md:py-3 items-center h-full mx-auto">
        <h1 className="text-white font-light w-full tracking-tight text-sm 2xl:text-lg ">
          {questions[0]}
        </h1>
        <div className="xs:w-full flex items-center gap-x-2">
          <ChecksButton answer={true} merit={merit} action={getMerit} />
          <ChecksButton answer={false} merit={merit} action={getMerit} />
        </div>
      </div>
      <div className="flex-col gap-y-4 md:py-5 items-center h-full mx-auto">
        <h1 className="text-white font-light mb-2 w-full tracking-tight text-sm 2xl:text-lg ">
          {questions[1]}
        </h1>
        <div className="xs:w-full flex items-center gap-x-2">
          <ChecksButton answer={true} merit={movedOnIdea} action={moved} />
          <ChecksButton answer={false} merit={movedOnIdea} action={moved} />
        </div>
      </div>
    </motion.div>
  );
}
