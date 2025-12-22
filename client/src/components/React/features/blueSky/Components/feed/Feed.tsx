import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetBlueSkyState } from "@/state/Reducers/BlueSky/BlueSkySlice";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/state/store";
import Scroller from "../../Containers/Scroller";
import { splitPosts } from "@/helpers/Presentation";
import { variants } from "@/motion/variants";


type FeedProps = {
  posts: any,
  shouldAnimate?: boolean
};

export default function Feed({ posts, shouldAnimate = true }: FeedProps): JSX.Element {
  const selected = useSelector((state: RootState) => state.bluesky.selected);
  const postForPopover = useSelector((s: RootState) => s.bluesky.popoverPost);
  const [firstHalf, setFirstHalf] = useState<any>(null);
  const [secondHalf, setSecondHalf] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const playAnimation = (shouldAnimate && (!postForPopover));


  useEffect(() => {
    const handleNew = () => {
      setFirstHalf(null);
      setSecondHalf(null);
      dispatch(resetBlueSkyState());
    };
    window.addEventListener('newSearch', handleNew);

    try {
      const stored = localStorage.getItem('bsPosts');

      if (stored) {
        splitPosts(stored, setFirstHalf, setSecondHalf);
      };

    } catch (error) {
      console.log(error);
    }
    return () => window.removeEventListener('newSearch', handleNew);

  }, [posts]);

  return (
    <motion.div
      variants={variants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
      className='relative mx-auto px-4 lg:px-16 overflow-y-hidden'>
      <div

        style={{
          animationPlayState: (selected) && (shouldAnimate) ? 'paused' : 'running'
        }}
        className='items-center space-x-6 pb-12 lg:pb-0 lg:space-x-8 animate-scroller2 group
          md:animate-none relative lg:px-4 mx-auto grid grid-cols-1 lg:grid-cols-2'>
        <div
          style={{ transform: 'translateZ(0)' }}
          className={`relative transform-gpu will-change-transform [contain:layout_paint] backface-hidden flex-shrink-0 h-full items-center animate-scroller2 
            ${playAnimation ? 'animation-running md:hover:animation-paused' : 'animation-paused'}
          `}>

          {firstHalf !== null &&
            <Scroller

              posts={firstHalf}
            />
          }
        </div>
        <div
          style={{ transform: 'translateZ(0)' }}
          className={`relative transform-gpu will-change-transform [contain:layout_paint] backface-hidden flex-shrink-0 h-full items-center animate-scroller 
              ${playAnimation ? 'animation-running md:hover:animation-paused' : 'animation-paused'}
          
          `}>

          {secondHalf !== null &&
            <Scroller
              posts={secondHalf}
            />
          }
        </div>
      </div>
    </motion.div>
  )
}