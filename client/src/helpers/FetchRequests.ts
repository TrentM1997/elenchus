

const options: OptionsTypes = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
};

export interface ArticleOptionsFetch {
    message: string,
    data: ArticleType[] | null,
    errorType?: 'timeout' | 'abort' | 'http' | 'network';
    status?: number;
    errorMessage?: string;
};

export async function fetchArticles(query: string, timeout?: number, externalSignal?: AbortSignal): Promise<ArticleOptionsFetch> {
    const controller: AbortController = new AbortController();
    const signal: AbortSignal = controller.signal;
    const searchingFor = encodeURIComponent(query);
    let onExternalAbort: (() => void) | undefined;
    const options: OptionsTypes = {
        method: 'GET',
        signal: signal,
        headers: {
            Accept: 'application/json',
        },
    };

    if (externalSignal && externalSignal.aborted) {
        controller.abort("cancelled externally");
    } else if (externalSignal) {
        onExternalAbort = () => controller.abort('cancelled externally');
        externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    };

    const timer = window.setTimeout(() => {
        controller.abort("Fetch exceeded the maximum time limit");
    }, timeout ?? 5000);

    try {
        const response = await fetch(`/newsArticles?q=${searchingFor}`, options
        )
        if (!response.ok) {
            throw new Error(`There was a network response issue! - ${response.status} - ${response.statusText}`)
        }
        const jsonResponse: ArticleOptionsFetch = await response.json();
        if (jsonResponse) {
            return jsonResponse;
        }
    } catch (err) {
        if (err) {
            if (err.name === 'AbortError') {
                console.log({ AbortError: err });
                return { message: 'failed', data: null };
            } else {
                console.error(err);
                return { message: 'failed', data: null };
            }
        };
    } finally {
        if (onExternalAbort) externalSignal?.removeEventListener('abort', onExternalAbort);
        clearTimeout(timer);
    };
};

export const getWikiDetails = async (
    term: string,
    setExplanation: (explanation: any) => void
): Promise<void> => {

    const encodedQuery: string = encodeURIComponent(term);

    const url: string = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedQuery}`;

    try {
        const result = await fetch(url, options);
        if (!result.ok) {

            throw new Error('Could not connect to Wikipedia API!');
        }
        const data = await result.json();
        if (data) {
            setExplanation(data);
        } else {
            setExplanation("failed to connect to Wikipedia API :/");
        }

    } catch (err) {
        console.log(err);
    };
};