interface BlueSkyHeader {
    children: JSX.Element | null
};


export default function BlueSkyHeader({ children }: BlueSkyHeader): JSX.Element | null {

    return (
        <div
            className='lg:px-20 lg:pb-0 relative'>
            <div className='flex flex-col justify-center items-start 
            gap-y-4
            border-b px-2 md:px-0 border-white/10 pt-2 pb-6 lg:pt-16 lg:pb-8'>
                <HeaderTitle />
                <BlueSkyCopy />

                {children}
            </div>
        </div>
    );
};


function HeaderTitle(): JSX.Element | null {

    return (
        <div className='flex items-center gap-x-2 w-fit lg:mb-16'>
            <div className="lg:w-7 lg:h-7 h-6 w-6 mx-auto text-white/90">
                <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-bluesky"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.335 5.144c-1.654 -1.199 -4.335 -2.127 -4.335 .826c0 .59 .35 4.953 .556 5.661c.713 2.463 3.13 2.75 5.444 2.369c-4.045 .665 -4.889 3.208 -2.667 5.41c1.03 1.018 1.913 1.59 2.667 1.59c2 0 3.134 -2.769 3.5 -3.5c.333 -.667 .5 -1.167 .5 -1.5c0 .333 .167 .833 .5 1.5c.366 .731 1.5 3.5 3.5 3.5c.754 0 1.637 -.571 2.667 -1.59c2.222 -2.203 1.378 -4.746 -2.667 -5.41c2.314 .38 4.73 .094 5.444 -2.369c.206 -.708 .556 -5.072 .556 -5.661c0 -2.953 -2.68 -2.025 -4.335 -.826c-2.293 1.662 -4.76 5.048 -5.665 6.856c-.905 -1.808 -3.372 -5.194 -5.665 -6.856z" /></svg>
            </div>
            <div className="text-zinc-300 text-2xl font-light tracking-tight">BlueSky Feed</div>
        </div>
    )
};


function BlueSkyCopy() {


    return (
        <div className="flex items-center justify-center h-auto w-auto">

            <div className="max-w-88 h-full">
                <p aria-label="bluesky instructions"
                    className="text-zinc-300 font-light tracking-tight text-wrap text-sm"
                >
                    Easily browse BlueSky and select any post to investigate its claims
                </p>
            </div>
        </div>
    )
}


