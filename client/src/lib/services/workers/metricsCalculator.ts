import { assertNever } from "@/lib/helpers/asserts/assertNever";
import type { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";
import type { BiasSchemaType } from "@/lib/schemas/articles/BiasSchema";
import type { InvestigationSchemaType } from "@/lib/schemas/investigations/InvestigationSchema";

export type MetricsRequest = {
  articles: ArticleSchemaType[];
  investigations: InvestigationSchemaType[];
};

export type MetricsPayload = {
  bias: number[];
  integrity: number[];
  outcomes: StatBreakdownTypes;
};

interface IMetricsCalculator {
  getMetrics(
    articles: ArticleSchemaType[],
    investigations: InvestigationSchemaType[],
  ): MetricsPayload;
}

class MetricsCalculator implements IMetricsCalculator {
  public getMetrics(
    articles: ArticleSchemaType[],
    investigations: InvestigationSchemaType[],
  ): MetricsPayload {
    return {
      bias: this.calcBiases(articles),
      integrity: this.getIntegrity(articles),
      outcomes: this.getOutcomes(investigations),
    };
  }

  private getOutcomes(
    investigations: InvestigationSchemaType[],
  ): StatBreakdownTypes {
    return {
      neededMore: this.calcNeedMore(investigations),
      validated: this.calcValidated(investigations),
      neutral: this.calcNeutral(investigations),
      percentChanged: this.calcPercentChanged(investigations),
    };
  }

  private calcNeedMore(investigations: InvestigationSchemaType[]): number {
    let counter = 0;
    let total = investigations.length;
    for (let i = 0; i < investigations.length; i++) {
      let initial = investigations[i].initial_perspective;
      let end = investigations[i].ending_perspective;

      if (!initial && !end) {
        counter++;
      }
    }
    return total === 0 ? 0 : Math.floor((counter / total) * 100);
  }

  private calcNeutral(investigations: InvestigationSchemaType[]): number {
    let counter = 0;
    let total = investigations.length;
    for (let i = 0; i < investigations.length; i++) {
      let neutral = investigations[i].ending_perspective === "Neutral";

      if (neutral) {
        counter++;
      }
    }

    return total === 0 ? 0 : Math.floor((counter / total) * 100);
  }

  private calcValidated(investigations: InvestigationSchemaType[]): number {
    let counter = 0;
    let total = investigations.length;
    for (let i = 0; i < investigations.length; i++) {
      let initial = investigations[i].initial_perspective;
      let end = investigations[i].ending_perspective;

      if (initial && end && initial === end) {
        counter++;
      }
    }

    return total === 0 ? 0 : Math.floor((counter / total) * 100);
  }

  private calcPercentChanged(
    investigations: InvestigationSchemaType[],
  ): number {
    let counter = 0;
    const total = investigations.length;
    for (let i = 0; i < investigations.length; i++) {
      const initial = investigations[i].initial_perspective;
      const end = investigations[i].ending_perspective;
      if (!initial || !end) continue;
      if (initial !== end) {
        counter++;
      }
    }
    return total === 0 ? 0 : Math.floor((counter / total) * 100);
  }

  private getIntegrity(articles: ArticleSchemaType[]): number[] {
    return this.getSourceIntegrity(this.extractRatings(articles));
  }

  private extractRatings(
    articles: ArticleSchemaType[],
  ): ArticleSchemaType["factual_reporting"][] {
    const factualReporting: ArticleSchemaType["factual_reporting"][] = [];

    for (const article of articles) {
      const factualRating = article.factual_reporting;
      factualReporting.push(factualRating);
    }
    return factualReporting;
  }

  private getSourceIntegrity(
    factualReportRatings: ArticleSchemaType["factual_reporting"][],
  ): number[] {
    let integrityRatings = {
      "Very High": 0,
      High: 0,
      "Mostly Factual": 0,
      Mixed: 0,
      Low: 0,
      "Very Low": 0,
      "Conspiracy-Pseudoscience": 0,
      "Pro-Science": 0,
      "Questionable Source": 0,
      Satire: 0,
      Unknown: 0,
    } satisfies IntegrityRatings;

    for (const rating of factualReportRatings) {
      switch (rating) {
        case "Very High":
          integrityRatings["Very High"]++;
          break;
        case "High":
          integrityRatings.High++;
          break;
        case "Mostly Factual":
          integrityRatings["Mostly Factual"]++;
          break;
        case "Mixed":
          integrityRatings.Mixed++;
          break;
        case "Low":
          integrityRatings.Low++;
          break;
        case "Very Low":
          integrityRatings["Very Low"]++;
          break;
        case "Conspiracy-Pseudoscience":
          integrityRatings["Conspiracy-Pseudoscience"]++;
          break;

        case "Pro-Science": {
          integrityRatings["Pro-Science"]++;
          break;
        }

        case "Questionable Source": {
          integrityRatings["Questionable Source"]++;
          break;
        }

        case "Satire": {
          integrityRatings.Satire++;
          break;
        }

        case "Unknown": {
          integrityRatings.Unknown++;
          break;
        }

        case null: {
          integrityRatings.Unknown++;
          break;
        }

        default: {
          assertNever(rating);
        }
      }
    }

    const arr = Object.values(integrityRatings);

    return arr;
  }

  private calcBiases(articles: ArticleSchemaType[]): number[] {
    const counts = {
      Right: this.numBiasSources(articles, "Right", "Right-Center"),
      Left: this.numBiasSources(articles, "Left", "Left-Center"),
      Center: this.numBiasSources(articles, "Least Biased", "Center"),
      Conspiracy: this.numBiasSources(articles, "Conspiracy-Pseudoscience"),
      Questionable: this.numBiasSources(articles, "Questionable"),
      Scientific: this.numBiasSources(articles, "Pro-Science"),
      Satire: this.numBiasSources(articles, "Satire"),
      Unknown: this.numBiasSources(articles, "Unknown"),
    };
    return Object.values(counts);
  }

  private numBiasSources(
    articles: ArticleSchemaType[],
    leaningOne: BiasSchemaType,
    leaningTwo?: BiasSchemaType,
  ): number {
    let count = 0;

    for (let i = 0; i < articles.length; i++) {
      const bias = articles[i].bias ?? "Unknown";

      if (bias === leaningOne) {
        count++;
      } else if (leaningTwo && bias === leaningTwo) {
        count++;
      } else {
        continue;
      }
    }
    return count;
  }
}
const calculator = new MetricsCalculator();

self.onmessage = (event: MessageEvent<MetricsRequest>) => {
  const { articles, investigations } = event.data;
  const chartData = calculator.getMetrics(articles, investigations);

  self.postMessage({ chartData });
};
