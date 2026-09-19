import { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary";
import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import DetailView from "../../../ProfileNavigation/mobile/DetailView";
import { chooseTab } from "@/state/Reducers/Dashboard/UserContent/DashboardTabs";
import RenderSavedArticle from "./RenderSavedArticle";

export default function ArticleReview() {
  const article = useSelector(
    (state: RootState) => state.userdata.ArticleToReview,
  );
  const dispatch = useDispatch<AppDispatch>();

  const backTo = () => {
    dispatch(chooseTab("Articles"));
  };

  return (
    <motion.section
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "tween", duration: 0.4, delay: 0.7 }}
      className="min-h-dvh h-dvh pb-[6.5rem] w-full flex items-center justify-center overflow-hidden
                        mx-auto relative mt-16 xl:mt-6"
    >
      <DetailView backTo={backTo} />

      <main
        className="2xl:max-w-7xl xl:w-4/5 lg:max-w-4xl md:w-4/5 grow
                sm:w-3/4  w-80 h-full overflow-y-auto no-scrollbar scroll-smooth scrollbar-gutter-stable-both overscroll-contain
                 xl:px-24
                 "
      >
        <ErrorBoundary>
          <RenderSavedArticle state={article} />
        </ErrorBoundary>
      </main>
    </motion.section>
  );
}
