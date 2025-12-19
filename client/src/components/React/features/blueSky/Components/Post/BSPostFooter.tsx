import type { BlueSkyPost } from "@/ReduxToolKit/Reducers/BlueSky/BlueSkySlice";

interface BSPostFooterProps {
    text: BlueSkyPost["record"]["text"],
    likeCount: BlueSkyPost["likeCount"],
    selected: any
};


function BSPostFooter({ text, selected, likeCount }: BSPostFooterProps): JSX.Element {
    const active: boolean = (text === selected);

    return (
        <footer className="w-full mx-auto flex items-center relative bottom-0 pt-2">
            <svg
                className={`icon icon-tabler icons-tabler-outline icon-tabler-heart ${active ? 'text-zinc-500' : 'text-zinc-300'}`}
                xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
            <p
                className={`text-sm  ${active ? 'text-black/70' : 'text-zinc-300'}`}
            >
                {likeCount}
            </p>
        </footer>
    );
};

export { BSPostFooter };