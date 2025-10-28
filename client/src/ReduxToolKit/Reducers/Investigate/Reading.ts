import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { progress } from 'framer-motion';
import { act } from 'react';

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
                    thunkApi.dispatch(updateProgress(statusJson.result.progress));
                }
                if (statusJson.status) {
                    thunkApi.dispatch(updateStatus(statusJson.status));
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
    getContent: boolean | null,
    articles: Array<Article> | null,
    failedNotifications: Array<any> | null,
    currentStory: number | null,
    reading: boolean | null,
    paginateLimit: boolean | null,
    ContentStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected',
    error: string | null;
    progress: Prog;
};


const initialState: ReadingState = {
    status: 'idle',
    getContent: false,
    articles: null,
    failedNotifications: null,
    currentStory: 0,
    reading: false,
    paginateLimit: false,
    ContentStatus: 'idle',
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
        restoreStatus: (state) => {
            state.ContentStatus = 'idle';
        },
        updateStatus: (state, action) => {
            state.status = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(runFirecrawlExtraction.pending, (state) => {
                state.status = 'pending';
                state.error = null;
                state.articles = null;
                state.failedNotifications = [];
            })
            .addCase(runFirecrawlExtraction.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.articles = action.payload.retrieved;
                state.failedNotifications = action.payload.rejected;
                state.error = null;
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


export type ReadingSlice = ReturnType<typeof ReadingSlice.reducer>;

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
    restoreStatus } = ReadingSlice.actions

export default ReadingSlice.reducer