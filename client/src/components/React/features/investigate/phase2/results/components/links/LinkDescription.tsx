import { limitString } from "@/helpers/Presentation";
import { slugLogo } from "@/components/React/global/Articles/SuccessFull/components/hero/PublishedBy";
import { LOGOS } from "@/helpers/lookup/logos";
import { useMemo } from "react";
import React from "react";

interface LinkDescription {
    isPriority?: boolean,
    chosen?: boolean,
    provider?: string,
    logo?: string,
    description?: string,
    inModal?: boolean
};

function LinkDescription({ isPriority, chosen, provider, logo, description, inModal }: LinkDescription) {
    const providerSlug = useMemo(() => slugLogo(provider ?? ""), [logo]);
    const logoPath = useMemo(() => {
        const altPath = LOGOS[providerSlug] ?? logo;
        return altPath;
    }, [provider]);

    const formattedDescription = limitString(description);

    return (
        <div className="relative w-full mx-auto p-2 flex flex-col gap-8 sm:gap-3 md:gap-5 lg:gap-2 h-auto box-border">
            <div className="inline-flex items-center gap-1.5
h-10 px-2 rounded-full
bg-white/10 ring-1 ring-white/15
backdrop-blur-sm
text-[11px] font-medium tracking-wide text-white/90">
                <div>
                    <img
                        className="lg:h-8 lg:w-8 xs:h-6 xs:w-6"
                        loading={isPriority ? 'eager' : 'lazy'}
                        decoding={isPriority ? 'sync' : 'async'}
                        src={logoPath}
                        alt=""
                    />
                </div>

                <div className={`${(chosen && !inModal) ? 'group-hover:text-black' : 'group-hover:text-blue-400'} transition-colors ease-soft duration-200 h-fit text-lg sm:text-xs text-left lg:text-sm xl:text-base font-serif text-white`}>
                    {provider}
                </div>
            </div>
            <div className={`h-full ${chosen ? 'opacity-100' : ''}`}>
                <blockquote className='relative'>
                    <p className='lg:text-sm text-zinc-400 text-base sm:text-xs text-left transition-colors duration-100 font-serif font-light'>
                        {formattedDescription}
                    </p>
                </blockquote>
            </div>
        </div>
    )
};


export default React.memo(LinkDescription);