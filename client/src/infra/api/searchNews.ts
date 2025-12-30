import type { SearchEndpoint } from "../transport/types/types";
import { options } from "@/helpers/tokens/fetchOptions";

export interface ArticleOptionsFetch {
    message: string,
    data: ArticleType[] | null,
    errorType?: 'timeout' | 'abort' | 'http' | 'network';
    status?: number;
    errorMessage?: string;
};

async function searchNews(endpoint: SearchEndpoint, params: string, signal: AbortSignal): Promise<ArticleOptionsFetch> {

    const urlQuery = `${endpoint}?q=${params}`;

    try {
        const response = await fetch(urlQuery, { ...options, signal });

        if (!response.ok) {
            return {
                message: 'failed',
                data: null,
                errorType: 'http',
                status: response.status,
                errorMessage: response.statusText
            };
        }

        const json = await response.json();
        return json;

    } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
            return {
                message: 'failed',
                data: null,
                errorType: 'abort',
                errorMessage: 'Request aborted'
            };
        }

        return {
            message: 'failed',
            data: null,
            errorType: 'network',
            errorMessage: err instanceof Error ? err.message : 'Unknown error'
        };
    }
};


export { searchNews };