import { decrementPage, incrementPageBy } from "@/state/Reducers/Investigate/SearchResults"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/state/store"
import PageButton from "./PageButton"
import DecrementPage from "./DecrementPage"
import IncrementPage from "./IncrementPage"
import { useCallback } from "react"

interface LinkPaginationProps {
    disabled: boolean | null
};

export default function LinkPagination({ disabled }: LinkPaginationProps): React.ReactNode {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const { search } = investigateState
    const { currentPage, pages } = search
    const dispatch = useDispatch()

    const decrement = () => {

        if (currentPage > 0) {
            dispatch(decrementPage())
        } else if (currentPage > 0) {
            dispatch(decrementPage())
        }
    };

    const increment = () => {

        const value = (currentPage + 1) % pages.length
        dispatch(incrementPageBy(value))
    }

    const handleNumberedClick = useCallback((index: number) => {
        if (currentPage !== index) {
            dispatch(incrementPageBy(index))
        }
    }, [currentPage]);


    return (
        <div
            className="w-auto h-20 flex items-start justify-center opacity-0 animate-fade-in ease-soft transition-opacity animation-delay-400ms will-change-[opacity]">
            <div
                className={`relatvie w-full h-fit flex justify-center md:gap-x-6 mx-auto items-center`}>
                <div className={`row flex`}>
                    <DecrementPage disabled={disabled} decrement={decrement} />

                    {Array.isArray(pages) && (pages.length) > 0
                        && pages.map((_, index: number) => (
                            <PageButton key={`button ${index + 1}`} currentPage={currentPage} index={index} handleNumberedClick={handleNumberedClick} />
                        )
                        )}
                    <IncrementPage disabled={disabled} increment={increment} />
                </div>
            </div>

        </div>

    )
}