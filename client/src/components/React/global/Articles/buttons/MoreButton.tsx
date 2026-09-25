import More from "./More"

export default function MoreButton({ articleData, open, setOpen }) {

    //TODO: change 'more' options from showing all authors, to displaying more about the source bias information

    return (
        <div className='relative flex h-full w-full items-center justify-center'>
            {open &&
                <More
                    key={articleData.article_url}
                    setOpen={setOpen}
                    articleData={articleData}
                />
            }
            <div className="group/more relative flex h-full w-full items-center justify-center">

                {!open && (
                    <div
                        role="tooltip"
                        className="pointer-events-none invisible absolute bottom-full right-0 z-50 mb-2
                            w-max whitespace-nowrap rounded-md border border-black/20 bg-white px-2 py-1
                            text-center text-sm font-light tracking-tight text-black opacity-0 shadow-lg
                            transition-opacity duration-150 md:group-hover/more:visible md:group-hover/more:opacity-100
                            group-focus-within/more:visible group-focus-within/more:opacity-100"
                    >
                        More
                        <span className="absolute right-3 top-full h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-white" />
                    </div>
                )}

                <div
                    onMouseUp={() => { setOpen(prev => !prev) }}
                    className='box-border flex items-center hover:bg-white/10 transition-all duration-200 
            ease-in-out xs:py-1 xs:px-2 rounded-xl cursor-pointer'>
                    <button
                        className='flex items-center justify-center text-white xs:text-xs md:text-sm md:p-0.5
                    transition-all duration-200 ease-in-out my-auto xs:rounded-full md:rounded-md xs:w-5 lg:w-5 lg:h-5'
                    >   <a href={articleData.article_url} target='_blank'></a>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="100%" height="100%" fillRule="nonzero"><g fill="#ffffff" fillRule="nonzero" stroke="none" strokeWidth={1} strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={10} strokeDasharray="" strokeDashoffset={0} fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}><g transform="scale(8.53333,8.53333)"><path d="M5,12c-1.657,0 -3,1.343 -3,3c0,1.657 1.343,3 3,3c1.657,0 3,-1.343 3,-3c0,-1.657 -1.343,-3 -3,-3zM15,12c-1.657,0 -3,1.343 -3,3c0,1.657 1.343,3 3,3c1.657,0 3,-1.343 3,-3c0,-1.657 -1.343,-3 -3,-3zM25,12c-1.657,0 -3,1.343 -3,3c0,1.657 1.343,3 3,3c1.657,0 3,-1.343 3,-3c0,-1.657 -1.343,-3 -3,-3z" /></g></g></svg>
                    </button>
                </div>
            </div>


        </div>
    )
}
