import { motion } from "framer-motion";
import { startTransition, useEffect, useLayoutEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import ErrorBoundary from "../../../Shared/ErrorBoundaries/ErrorBoundary";
import { selectPost } from "@/ReduxToolKit/Reducers/BlueSky/BlueSkySlice";
import SearchBlueSky from "../Components/input/SearchBlueSky";
import BlueSkyHeader from "../Components/BlueSkyHeader";
import CloseBlueSky from "../Components/buttons/CloseBlueSky";
import { useNavigate } from "react-router-dom";
import { displayBlueSkySearch } from "@/ReduxToolKit/Reducers/Investigate/DisplayReducer";
import FeedContainer from "./FeedContainer";

interface BlueSkyProps {
  context: 'home' | 'investigate',
  shouldAnimate?: boolean
};

export default function BlueSky({ context, shouldAnimate = true }: BlueSkyProps) {
  const { posts } = useSelector((state: RootState) => state.bluesky, shallowEqual);
  const researchState = useSelector((state: RootState) => state.investigation);
  const navigate = useNavigate();
  const { idea } = researchState.pov;
  const dispatch = useDispatch();
  const shouldRedirect: boolean = context === 'home';
  const redirectTimer = useRef<number | null>(null);


  useLayoutEffect(() => {
    if (posts) {
      const storeThese = { bsPosts: posts };
      localStorage.setItem('bsPosts', JSON.stringify(storeThese));
    };

  }, [posts]);

  useEffect(() => {
    if (!idea) return

    if (idea && shouldRedirect) {

      redirectTimer.current = window.setTimeout(() => {
        startTransition(() => {
          navigate('/investigate');
        });
        redirectTimer.current = null;
      }, 850);

    }
    dispatch(displayBlueSkySearch(false));


    return () => {
      if (redirectTimer.current !== null) {
        clearTimeout(redirectTimer.current);
      }
      dispatch(selectPost(null));
    }

  }, [idea, shouldRedirect]);


  return (
    <div

      className="lg:p-8 w-full relative opacity-0 animate-fade-in animation-delay-200ms ease-soft"
    >
      <div className='mt-12 md:mt-6 p-4 w-full py-6 mx-auto md:px-12 lg:px-0  2xl:max-w-7xl h-full'
      >
        <div className="bg-gradientup mx-auto flex flex-col p-6 lg:p-0 shrink-0 
        grow rounded-4xl w-full h-auto md:max-w-5xl lg:max-w-6xl 2xl:min-w-6xl 
        xl:max-w-7xl relative overflow-hidden"
        >
          {context === 'investigate' &&
            <CloseBlueSky />
          }
          <BlueSkyHeader
          >
            <SearchBlueSky
            />
          </BlueSkyHeader>

          <ErrorBoundary
          >
            <FeedContainer
              shouldAnimate={shouldAnimate}
              key={'postsfetched'}
              context={context}
              posts={posts}
              shouldRedirect={shouldRedirect}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )

}








