export default function PieSkeleton() {

    return (
        <div className="relative w-72 h-72 lg:w-96 lg:h-96 animate-pulse">
            <div className="absolute inset-0 rounded-full bg-zinc-800/60" />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/5 h-[2px] bg-zinc-700 rotate-0 absolute" />
                <div className="w-3/5 h-[2px] bg-zinc-700 rotate-45 absolute" />
                <div className="w-3/5 h-[2px] bg-zinc-700 -rotate-45 absolute" />
                <div className="w-3/5 h-[2px] bg-zinc-700 rotate-90 absolute" />
            </div>
        </div>
    );
};