export interface Article {
  title: string;
  provider: string;
  authors: string[] | string;
  article_url: string;
  image_url: string;
  date_published: string;
  fallbackDate: string | null;
  summary: any;
  full_text: string;
  logo?: string;
  id: number | null;
  factual_reporting?: string | null;
  bias?: Bias;
  country?: string | null;
}

export type JobStatus = "pending" | "fulfilled" | "rejected";

export type Prog = "extraction complete" | string;
