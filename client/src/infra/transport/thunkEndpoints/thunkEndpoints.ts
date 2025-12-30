import type { ExtractArticleEndpoints } from "../types/types";



const firecrawlEndpoints: ExtractArticleEndpoints = {
    kickoff: "/firecrawl_extractions",
    polling: (jobId: string) => `/firecrawl_extractions/${jobId}`
};


export { firecrawlEndpoints };