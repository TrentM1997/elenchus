import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

type FactualReportingRating = NonNullable<
  ArticleSchemaType["factual_reporting"]
>;

export const factualReportingRatingConfig = [
  { rating: "Very High", color: "#0d9488" },
  { rating: "High", color: "#2628a1" },
  { rating: "Mostly Factual", color: "#a1a1aa" },
  { rating: "Mixed", color: "#64748b" },
  { rating: "Low", color: "#eab308" },
  { rating: "Very Low", color: "#f97316" },
  { rating: "Conspiracy-Pseudoscience", color: "#dc2626" },
  { rating: "Pro-Science", color: "#2e8b57" },
  { rating: "Questionable Source", color: "#71717a" },
  { rating: "Satire", color: "#8695f9" },
  { rating: "Unknown", color: "#ffffff" },
] as const satisfies readonly {
  rating: FactualReportingRating;
  color: string;
}[];

type GetPieChartParams = {
  config: typeof factualReportingRatingConfig;
  integrityRatings: IntegrityRatings;
};

export function getPieChartDataSet({
  config,
  integrityRatings,
}: GetPieChartParams) {
  const chartData = config.map(({ rating, color }) => ({
    rating,
    color,
    value: integrityRatings[rating],
  }));

  const labels = chartData.map(({ rating }) => rating);
  const colors = chartData.map(({ color }) => color);
  const values = chartData.map(({ value }) => value);

  return {
    labels,
    colors,
    values,
  };
}
