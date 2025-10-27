
interface ButtonHoverTooltip {
    description: string
}

export default function ButtonHoverTooltip({ description }: ButtonHoverTooltip): JSX.Element | null {


    return (
        <div className="absolute p-1 bg-white z-50 opacity-0 transition-opacity delay-500 duration-200 ease-soft md:group-hover:opacity-100 bottom-[3.3rem] -left-4
            rounded-md items-center border border-astro_gray shadow-thick after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 
            after:transform after:-translate-x-1/2 after:border-t-[10px] after:border-l-[10px] after:border-r-[10px] after:border-b-0 
            after:border-t-white after:border-l-transparent after:border-r-transparent after:border-b-transparent">
            <p className="text-black" >{description}</p>
        </div>
    );
};