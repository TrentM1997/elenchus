import DecrementPage from "./DecrementPage";
import IncrementPage from "./IncrementPage";
import RenderPaginationNumberedButtons from "./RenderPaginationNumberedButtons";
import { useSearchResultsPagination } from "@/lib/hooks/useSearchResultsPagination";

interface LinkPaginationProps {
  disabled: boolean | null;
}

export default function LinkPagination({
  disabled,
}: LinkPaginationProps): React.ReactNode {
  const { increment, decrement, handleNumberedClick, currentPage, pages } =
    useSearchResultsPagination();

  if (pages.status !== "ready") return null;

  return (
    <div
      className="w-auto h-20 flex items-start justify-center opacity-0 animate-fade-in 
    ease-soft transition-opacity animation-delay-400ms will-change-[opacity]"
    >
      <div
        className={`relatvie w-full h-fit flex justify-center md:gap-x-6 mx-auto items-center`}
      >
        <div className={`row flex`}>
          <DecrementPage disabled={disabled} decrement={decrement} />
          <RenderPaginationNumberedButtons
            pages={pages.data}
            handleNumberedClick={handleNumberedClick}
            currentPage={currentPage}
          />
          <IncrementPage disabled={disabled} increment={increment} />
        </div>
      </div>
    </div>
  );
}
