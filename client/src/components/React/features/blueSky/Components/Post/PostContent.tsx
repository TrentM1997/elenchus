import { RootState } from "@/state/store"
import { useSelector } from "react-redux"

interface PostContentProps {
    text: string | null
};

export default function PostContent({ text }: PostContentProps): React.ReactNode {
    const selected = useSelector((state: RootState) => state.bluesky.selected);

    return (
        <div className='h-full max-w-full overflow-x-hidden group mt-2 pt-2'>
            <blockquote className='relative'>
                <p className={`
                text-sm text-wrap 
                ${selected.status === "ready" && text === selected.data.record.text
                        ? 'text-black'
                        : 'text-white'
                    }`
                }>
                    {text}
                </p>
            </blockquote>
        </div>
    );
}