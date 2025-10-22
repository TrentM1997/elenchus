export default function PieSkeleton() {

    return (
        <div className="relative w-72 h-72 lg:w-96 lg:h-96 animate-pulse">
            <div className="absolute inset-0 rounded-full bg-[length:200%_100%] transform-gpu will-change-transform ease-soft
    bg-[linear-gradient(110deg,#1a1c23_8%,#2b2f3a_18%,#1a1c23_33%)] animate-shimmer" />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/5 h-[2px] bg-zinc-700 rotate-0 absolute" />
                <div className="w-3/5 h-[2px] bg-zinc-700 rotate-45 absolute" />
                <div className="w-3/5 h-[2px] bg-zinc-700 -rotate-45 absolute" />
                <div className="w-3/5 h-[2px] bg-zinc-700 rotate-90 absolute" />
            </div>
        </div>
    );
};