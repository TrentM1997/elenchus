import { searchNews } from "@/infra/api/searchNews";

export interface ArticleOptionsFetch {
    message: string,
    data: ArticleType[] | null,
    errorType?: 'timeout' | 'abort' | 'http' | 'network';
    status?: number;
    errorMessage?: string;
};

async function getArticles(query: string, timeout?: number, externalSignal?: AbortSignal): Promise<ArticleOptionsFetch> {
    const controller = new AbortController();
    const searchingFor = encodeURIComponent(query);
    let onExternalAbort: (() => void) | undefined;

    if (externalSignal?.aborted) {
        controller.abort('cancelled externally');
    } else if (externalSignal) {
        onExternalAbort = () => controller.abort('cancelled externally');
        externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }

    const timer = window.setTimeout(() => {
        controller.abort('timeout');
    }, timeout ?? 5000);

    try {
        return await searchNews(
            "/newsArticles",
            searchingFor,
            controller.signal
        );
    } finally {
        if (onExternalAbort) {
            externalSignal?.removeEventListener('abort', onExternalAbort);
        }
        clearTimeout(timer);
    }
};

export { getArticles };