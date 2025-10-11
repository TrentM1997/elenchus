import FailedLoading from "../Failed/FailedLoading";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { recordSources } from "@/ReduxToolKit/Reducers/UserContent/SaveInvestigationSlice";
import RenderArticles from "@/components/React/features/investigate/phase3/components/RenderArticles";
import { getSourcesToRecord, canUpdateSources } from "@/services/RecordSources";
import { clearChosenArticles } from "@/ReduxToolKit/Reducers/Investigate/ChosenArticles";
import { resetResults } from "@/ReduxToolKit/Reducers/Investigate/SearchResults";
import { resetReadingSlice } from "@/ReduxToolKit/Reducers/Investigate/Reading";

export default function ArticleContainer({ }) {
  const investigateState = useSelector((state: RootState) => state.investigation);
  const { read } = investigateState;
  const sources = useSelector((state: RootState) => state.userWork.sourcesToReview);
  const userArticles = useSelector((state: RootState) => state.userdata.userArticles);
  const sourcesToDispatch = sources;
  const { articles, failedNotifications, ContentStatus } = read;
  const firstRecordedSources = useRef<string>("");
  const dispatch = useDispatch();


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
      className="min-h-screen h-full 2xl:max-w-7xl xl:max-w-5xl
      lg:max-w-3xl md:max-w-3xl xs:px-2 md:px-8 scroll-smooth
      inset mx-auto border-white/10 relative"
    >
      <RenderArticles
      />
      {ContentStatus === 'fulfilled' &&
        <FailedLoading
        />
      }
    </div>
  )
}

