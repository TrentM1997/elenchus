import React from "react";
import { limitString } from "@/helpers/Presentation";

interface Topic {
    topic: string
}

function Topic({ topic }: Topic): JSX.Element | null {

    const clipped = topic ? limitString(topic, 70) : null;

    return (
        <div title={topic} className="xl:w-full lg:h-24 xl:h-28 flex flex-col justify-center items-start gap-2">
            <div className="text-white font-light tracking-tight text-mdm">Topic</div>
            <div className="text-zinc-400 text-md text-wrap">
                {clipped}
            </div>
        </div>

    );
};

export default React.memo(Topic);