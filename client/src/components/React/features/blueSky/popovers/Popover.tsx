import SelectedPost from "./SelectedPost";
import UseThisPost from "./UseThisPost";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { useLocation } from "react-router-dom";



export default function Popover(): JSX.Element | null {
  const popoverPost = useSelector((state: RootState) => state.bluesky.popoverPost);
  const location = useLocation();
  const shouldRedirect: boolean = (location.pathname === '/');

  return (

    <div className="opacity-0 animate-fade-blur animation-delay-400ms relative bg-black border border-border_gray
       h-fit w-88 sm:w-auto p-4 sm:p-8 rounded-3xl shadow-material z-[910]
      flex flex-col justify-center  items-center
      ">
      <header className="w-full h-auto">
        <h1 className="text-white font-light tracking-tight text-lg lg:text-xl xl:text-2xl text-center">
          Investigate this?
        </h1>
      </header>
      <SelectedPost
      />
      <UseThisPost
        post={popoverPost}
        shouldRedirect={shouldRedirect}
      />

    </div>
  );
};
