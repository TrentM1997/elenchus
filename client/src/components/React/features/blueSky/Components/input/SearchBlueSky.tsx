import type { JSX } from "react";
import Loader from "@/components/React/global/Loaders/Loader";
import SearchIcon from "@/components/React/global/IconComponents/SearchIcon";
import { useSearchBlueSky } from "@/lib/hooks/blueSky/useSearchBlueSky";

export default function SearchBlueSky(): JSX.Element {
  const { handleKeyDown, handleSubmit, getSearchInput, status } =
    useSearchBlueSky();

  return (
    <div className="relative flex w-full lg:w-88 items-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-white/10 text-white w-full h-fit md:hover:bg-white/15 ease-in-out
                         border-none md:h-10 md:p-0 2xl:px-0 rounded-full relative
                         transition-all duration-200 xs:text-sm md:text-lg flex items-center prose"
      >
        <input
          onChange={(e) => getSearchInput(e)}
          onKeyDown={(e) => handleKeyDown(e)}
          autoComplete="off"
          type="text"
          name="q"
          className="bg-transparent text-white w-full lg:w-96 h-fit 
                         border-none md:h-12 p-2 rounded-full relative focus:ring-0
                         transition-colors text-base md:text-lg font-light flex items-center placeholder-slate-300"
          placeholder="search posts"
        />
        <button type="submit" className="relative pr-2 grow-0">
          {status === "pending" ? <Loader /> : <SearchIcon />}
        </button>
      </form>
    </div>
  );
}

// const queried = new CustomEvent("newSearch");
