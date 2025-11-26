import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/ReduxToolKit/store";
import { modalStages } from "@/ReduxToolKit/Reducers/Investigate/WikipediaSlice";
import PanelLabel from "./PanelLabel";


export default function GetInfo({ failedExtraction }) {
    const wikiModalStages = useSelector((s: RootState) => s.investigation.wiki.wikiModalStages);
    const dispatch = useDispatch<AppDispatch>();

    const toggle = () => {
        dispatch(modalStages({
            display: true,
            highlight: true,
            confirmExtract: false,
            text: null
        }));
    };


    return (
        <div className={`${failedExtraction ? 'pointer-events-none opacity-30' : 'pointer-events-auto opacity-100 lg:hover:bg-border_gray/40'}
            flex shrink-0 w-fit h-10 lg:h-auto md:py-1.5 px-2.5 xl:px-2.5 group relative  group cursor-pointer
             transition-all ease-soft duration-300 justify-center items-center 
            `}>
            <button
                onClick={toggle}
                className="md:w-fit md:h-auto xs:max-w-8 xs:max-h-8 xl:max-w-7 xl:max-h-7 2xl:max-w-8 2xl:max-h-8 p-0.5
                rounded-lg transition-all duration-300 m-auto relative
                ease-in-out group">

                <GetInfoTooltip modalActive={wikiModalStages.display} />

                <div className="h-full w-full box-border">
                    <svg className={`icon group-hover:text-button_blue icon-tabler icons-tabler-filled icon-tabler-info-square transition-colors duration-300 ease-soft delay-200 ${wikiModalStages.highlight ? 'text-button_blue' : 'text-pearl'}`} xmlns="http://www.w3.org/2000/svg" width={"100%"} height={"100%"} viewBox="0 0 24 24" fill="currentColor"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 2a3 3 0 0 1 2.995 2.824l.005 .176v14a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h14zm-7 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" /></svg>

                </div>
            </button>
            <PanelLabel description={"lookup"} />
        </div>
    )
};

interface GetInfoTooltipProps {
    modalActive: boolean
};

function GetInfoTooltip({ modalActive }: GetInfoTooltipProps): JSX.Element {

    return (
        <div className={`absolute p-1 bg-white z-50 opacity-0 transition-opacity duration-200 ease-soft pointer-events-none
            ${modalActive ? '' : 'md:group-hover:opacity-100'}
            delay-1000  bottom-[3.3rem] -left-5
                    rounded-md items-center border border-astro_gray shadow-thick after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 
                    after:transform after:-translate-x-1/2 after:border-t-[10px] after:border-l-[10px] after:border-r-[10px] after:border-b-0 
                    after:border-t-white after:border-l-transparent after:border-r-transparent after:border-b-transparent`}>
            <p className="text-black text-wrap">highlight to look up</p>
        </div>
    )
}