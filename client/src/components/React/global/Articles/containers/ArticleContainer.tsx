import FailedLoading from "../Failed/FailedLoading";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { recordSources } from "@/state/Reducers/UserContent/SaveInvestigationSlice";
import RenderArticles from "@/components/React/features/investigate/phase3/containers/RenderArticles";
import { getSourcesToRecord, canUpdateSources } from "@/services/RecordSources";
import { clearChosenArticles } from "@/state/Reducers/Investigate/ChosenArticles";
import { resetResults } from "@/state/Reducers/Investigate/SearchResults";
import { resetReadingSlice } from "@/state/Reducers/Investigate/Reading";
import type { ReadingSliceState } from "@/state/Reducers/Investigate/Reading";

export default function ArticleContainer({ }) {
  const sources = useSelector((state: RootState) => state.userWork.sourcesToReview);
  const sourcesToDispatch = sources;
  const { articles, failedNotifications, status }: ReadingSliceState = useSelector((state: RootState) => state.investigation.read, shallowEqual);
  const firstRecordedSources = useRef<string>("");
  const dispatch = useDispatch();
  const showNotifications = useMemo((): boolean => {
    const hasFailed = (Array.isArray(failedNotifications)) && (failedNotifications.length > 0);
    const fulfilled = (status === 'fulfilled');
    const show = hasFailed && fulfilled;
    return show;
  }, [status, failedNotifications]);


  useEffect(() => {

    return () => {
      dispatch(clearChosenArticles());
      dispatch(resetResults());
      dispatch(resetReadingSlice());
    }
  }, [dispatch]);

  useEffect(() => {


    const executeRecordSources = () => {
      const data = getSourcesToRecord(articles, failedNotifications);
      const canUpdate = canUpdateSources(data, firstRecordedSources.current);
      if (canUpdate) {
        dispatch(recordSources(data.urls));
        firstRecordedSources.current = data.recordedString
      };
    };

    if (Array.isArray(articles) && (articles.length > 0)) executeRecordSources();

    if (sources) localStorage.setItem('cachedSources', JSON.stringify(sourcesToDispatch));


  }, [articles, sources]);


  return (
    <div
      className="min-h-screen h-full w-full scroll-smooth
      inset mx-auto border-white/10 relative"
    >
      <RenderArticles
      />
      {showNotifications &&
        <FailedLoading
        />
      }
    </div>
  )
}

