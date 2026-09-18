import {
  validateOrThrow,
  validateServerOrThrow,
} from "../../core/validation/validateOrThrow.js";
import { actionErrorValidator } from "../../schemas/WikipediaActionSchemas.js";
import {
  WikipediaLinksSchema,
  WikipediaSummarySchema,
  WikipediaTermSchema,
  WikiResponseSchema,
  type WikipediaLinks,
  type WikipediaSummaryType,
  type WikiDisambigCandidate,
  type WikiResponse,
} from "../../schemas/WikipediaSchemas.js";

export interface IWikipediaService {
  extract(query: string): Promise<WikiResponse>;
}

export class WikipediaService implements IWikipediaService {
  public async extract(query: string): Promise<WikiResponse> {
    return await this.extractQuery(query);
  }

  public async extractQuery(query: string): Promise<WikiResponse> {
    try {
      const term = validateOrThrow(WikipediaTermSchema, query.trim());
      const summary = await this.queryWiki(term);
      const response = await this.buildResponse(summary);

      return validateServerOrThrow(WikiResponseSchema, response);
    } catch (err) {
      return {
        kind: "error",
        message:
          err instanceof Error ? err.message : "Wikipedia request failed",
      };
    }
  }

  private async queryWiki(query: string): Promise<WikipediaSummaryType> {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const response = await fetch(url, this.getFetchOptions());

    if (!response.ok) {
      throw new Error(`REST summary failed: ${response.status}`);
    }

    const result: unknown = await response.json();
    return validateServerOrThrow(WikipediaSummarySchema, result);
  }

  private async buildResponse(
    summary: WikipediaSummaryType,
  ): Promise<WikiResponse> {
    const metadata = {
      title: summary.title,
      pageUrl: summary.content_urls.desktop.page,
      lastUpdated: summary.timestamp,
    };

    if (summary.type === "disambiguation") {
      return {
        kind: "disambiguation",
        ...metadata,
        candidates: await this.getDisambigCandidates(summary),
      };
    }

    return {
      kind: "summary",
      ...metadata,
      extract: summary.extract,
      description: summary.description ?? "",
      thumbnail: summary.thumbnail?.source ?? null,
    };
  }

  private async getDisambigCandidates(
    summary: WikipediaSummaryType,
  ): Promise<WikiDisambigCandidate[]> {
    const result = await this.fetchDisambigCandidates(summary.title);

    return (result.query?.pages ?? []).flatMap((page) => {
      if (page.missing === true) return [];

      return [
        {
          pageid: page.pageid,
          title: page.title,
          extract: page.extract ?? "",
          thumbnail: page.thumbnail?.source ?? null,
          url: `https://en.wikipedia.org/?curid=${page.pageid}`,
          lastUpdated: null,
        },
      ];
    });
  }

  private async fetchDisambigCandidates(
    title: string,
  ): Promise<WikipediaLinks> {
    const response = await fetch(
      this.getDisambigUrl(title),
      this.getFetchOptions(),
    );

    if (!response.ok) {
      throw new Error(`Action API failed: ${response.status}`);
    }

    const result: unknown = await response.json();

    if (actionErrorValidator.Check(result)) {
      throw new Error(`Wikipedia: ${result.error.code}: ${result.error.info}`);
    }

    return validateServerOrThrow(WikipediaLinksSchema, result);
  }

  private getFetchOptions(): RequestInit {
    return {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Api-User-Agent": "Elenchus/1.0 (mailto:you@example.com)",
      },
    };
  }

  private getDisambigUrl(title: string): string {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      redirects: "1",
      titles: title,
      generator: "links",
      gplnamespace: "0",
      gpllimit: "50",
      prop: "extracts|pageimages",
      exintro: "1",
      explaintext: "1",
      exchars: "200",
      exlimit: "max",
      piprop: "thumbnail",
      pithumbsize: "160",
      pilimit: "max",
    });

    return `https://en.wikipedia.org/w/api.php?${params.toString()}`;
  }
}
