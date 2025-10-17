import React from "react";



function KeyboardScroller({ playAnimation }): JSX.Element | null {

    return (
        <div className={`
        ${playAnimation
            && 'animate-marquee [will-change:transform] [contain-intrinsic-size:180rem_12rem]'} 
        opacity-50 whitespace-nowrap gap-4 flex
        `}
        >
            {[
                "/images/assets/lightKeyboard.svg",
                "/images/assets/darkKeyboard.svg",
                "/images/assets/lightKeyboard.svg",
                "/images/assets/darkKeyboard.svg",
                "/images/assets/lightKeyboard.svg",
                "/images/assets/darkKeyboard.svg",
            ].map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt="Keyboard thumbnail"
                    className="lg:w-[30rem] lg:flex-none"
                />
            ))}
        </div>
    )
};


export default React.memo(KeyboardScroller);