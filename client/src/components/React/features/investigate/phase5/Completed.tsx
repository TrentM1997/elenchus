import Lottie from "lottie-react"
import blueCheck from '@/lotties/blueCheck.json'


export default function Completed() {

    return (
        <article className="2xl:min-w-[60rem] w-full md:w-4/5 h-fit md:h-full mx-auto flex flex-col items-center md:gap-y-6 relative">
            <header className="h-fit w-full flex justify-center gap-x-1">
                <h1 className="md:text-3xl text-base text-nowrap text-white tracking-tight font-light">
                    All Done!
                </h1>
                <h1 className="md:text-3xl text-base text-nowrap text-zinc-400 tracking-tight font-light">
                    Case Closed
                </h1>
            </header>
            <main className="w-full h-full flex items-center justify-center">
                <div className="w-1/2 md:w-1/4 h-fit">
                    <Lottie animationData={blueCheck} loop={false} autoPlay={false} style={{ height: "100%", width: "100%", position: "relative" }} />
                </div>
            </main>


        </article>
    )
}