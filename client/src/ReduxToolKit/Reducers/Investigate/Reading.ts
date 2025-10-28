import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Article {
    title: string,
    provider: string,
    authors: string[] | string,
    article_url: string,
    image_url: string,
    date_published: string,
    fallbackDate: string | null,
    summary: any,
    full_text: string,
    logo?: string,
    id: number | null,
    factual_reporting?: string | null,
    bias?: Bias,
    country?: string | null
}

interface FailedAttempt {
    title: string;
    summary: {
        denied: string;
        failedArticle: string;
    }[];
    logo: string;
    source: string;
    date: string;
    article_url: string;
};

export type JobStatus = 'pending' | 'fulfilled' | 'rejected';

export type Prog = 'extraction complete' | string;

interface FirecrawlJobStatus {
    status: JobStatus
    result: {
        progress: Prog,
        retrieved: Article[] | null;
        rejected: FailedAttempt[];
    } | null;
    error: string | null;
    createdAt: number | null;
}

interface FirecrawlSuccessPayload {
    retrieved: Article[] | null;
    rejected: FailedAttempt[];
    progress: Prog
}


export const runFirecrawlExtraction = createAsyncThunk<
    FirecrawlSuccessPayload,
    { articles: SelectedArticle[] },
    { rejectValue: string }
>(
    'investigate/runFirecrawlExtraction',
    async (payload, thunkApi) => {
        const { signal, rejectWithValue } = thunkApi;
        const { articles } = payload;
        const EXHAUSTED = articles.length;
        let jobId: string;
        try {
            const kickoffRes = await fetch('/firecrawl_extractions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articles: articles }),
                signal,
            });

            if (!kickoffRes.ok) {
                const errText = await kickoffRes.text();
                return rejectWithValue(
                    `Failed to start extraction job (${kickoffRes.status}): ${errText}`
                );
            }

            const kickoffJson: { jobId: string } = await kickoffRes.json();
            jobId = kickoffJson.jobId;
        } catch (err: any) {
            return rejectWithValue(`Network error starting job: ${err.message}`);
        }

        const pollEndpoint = `/firecrawl_extractions/${jobId}`;

        const pollDelay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        while (true) {
            if (signal.aborted) {
                return rejectWithValue('Extraction canceled by user/navigation');
            }

            let statusJson: FirecrawlJobStatus;

            try {
                const statusRes = await fetch(pollEndpoint, { signal, method: 'GET' });

                if (statusRes.status === 404) {
                    return rejectWithValue('Job not found or expired.');
                }

                if (!statusRes.ok) {
                    const errText = await statusRes.text();
                    return rejectWithValue(
                        `Bad status fetch (${statusRes.status}): ${errText}`
                    );
                }

                statusJson = (await statusRes.json()) as FirecrawlJobStatus;
                if (statusJson.result !== null) {
                    console.log(statusJson.result);
                    thunkApi.dispatch(updateProgress(statusJson.result.progress));
                }

                if (statusJson.status) {
                    thunkApi.dispatch(updateStatus(statusJson.status));
                }

                if (statusJson?.result?.retrieved) {
                    thunkApi.dispatch(appendArticles(statusJson.result.retrieved));
                }
                if (statusJson?.result?.rejected) {
                    thunkApi.dispatch(appendFailures(statusJson.result.rejected))
                }


            } catch (err: any) {
                return rejectWithValue(`Network error polling job: ${err.message}`);
            }

            if (statusJson.status === 'fulfilled') {
                const finalResult = statusJson.result;

                if (!finalResult) {
                    return rejectWithValue('Job finished but no result payload.');
                }

                const payload: FirecrawlSuccessPayload = {
                    progress: finalResult.progress,
                    retrieved: finalResult.retrieved,
                    rejected: finalResult.rejected,
                };

                return payload;
            }

            if (statusJson.status === 'rejected') {
                return rejectWithValue(
                    statusJson.error || 'Extraction failed on server.'
                );
            }

            await pollDelay(1500);
        }
    }
);



interface ReadingState {
    status: 'idle' | 'pending' | 'fulfilled' | 'rejected',
    getContent: boolean,
    articles: Array<Article>,
    failedNotifications: Array<FailedAttempt>,
    currentStory: number,
    reading: boolean,
    paginateLimit: boolean,
    error: string | null;
    progress: Prog;
};


const initialState: ReadingState = {
    status: 'idle',
    getContent: false,
    articles: [],
    failedNotifications: [],
    currentStory: 0,
    reading: false,
    paginateLimit: false,
    error: null,
    progress: '0'
};


export const ReadingSlice = createSlice({
    name: 'readingReducer',
    initialState: initialState,
    reducers: {
        getStories: (state, action) => {
            state.getContent = action.payload
        },
        updateProgress: (state, action) => {
            const prev = state.progress;
            const next = action.payload;
            if (next !== prev) {
                state.progress = next;
            }
        },
        appendArticles: (state, action: PayloadAction<Article[]>) => {
            const nextBatch = action.payload;
            for (const batchItem of nextBatch) {
                const already = state.articles.find(a => a.article_url === batchItem.article_url);
                if (!already) {
                    state.articles.push(batchItem);
                }
            }
        },
        appendFailures: (state, action: PayloadAction<FailedAttempt[]>) => {
            const nextBatch = action.payload;
            for (const item of nextBatch) {
                const pre_existing = state.failedNotifications.find((i => i.article_url === item.article_url));
                if (!pre_existing) {
                    state.failedNotifications.push(item);
                };
            }
        },
        articleData: (state, action) => {
            state.articles = action.payload
        },
        rejected: (state, action) => {
            state.failedNotifications = action.payload
        },
        closeNotification: (state, action) => {
            state.failedNotifications.splice(action.payload, 1)
        },
        incrementStory: (state) => {
            state.currentStory = state.currentStory += 1
        },
        decrementStory: (state) => {
            state.currentStory -= 1
        },
        incrementStoryBy: (state, action) => {
            state.currentStory = action.payload
        },
        isReading: (state, action) => {
            state.reading = action.payload
        },
        resetReadingSlice: () => initialState,
        limitPagination: (state, action) => {
            state.paginateLimit = action.payload
        },

        updateStatus: (state, action) => {
            state.status = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(runFirecrawlExtraction.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(runFirecrawlExtraction.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.progress = action.payload.progress;
            })
            .addCase(runFirecrawlExtraction.rejected, (state, action) => {
                state.status = 'rejected';
                state.error =
                    (action.payload as string) ||
                    action.error.message ||
                    'Unknown error';
            });
    },
});


export type ReadingSliceState = ReturnType<typeof ReadingSlice.reducer>;

export const {
    articleData,
    updateStatus,
    updateProgress,
    rejected,
    incrementStory,
    decrementStory,
    incrementStoryBy,
    isReading,
    resetReadingSlice,
    closeNotification,
    limitPagination,
    appendArticles,
    appendFailures
} = ReadingSlice.actions

export default ReadingSlice.reducer