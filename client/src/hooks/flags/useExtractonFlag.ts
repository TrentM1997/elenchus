import { useEffect } from "react";
import type { ExtractionToast } from '@/components/React/app/App';
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { wait } from "@/helpers/formatting/Presentation";


const useExtractionFlag = (): void => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const TOASTKEY = 'extraction-toast:v1';
        const executeFlagCheck = async () => {
            await wait(1000);
            const raw: string | null = window.sessionStorage.getItem(TOASTKEY) as string ?? null;
            const parsed: ExtractionToast | null = raw ? JSON.parse(raw) as ExtractionToast : null;
            if (parsed && (parsed.shownToast === false)) {
                dispatch(renderModal('Article Extraction Warning'));
            };

        }
        try {
            executeFlagCheck();

        } catch {
            console.error('session storage may be corrupted');
        }
    }, []);

};


export { useExtractionFlag };
