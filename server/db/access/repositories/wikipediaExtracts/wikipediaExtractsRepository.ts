import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import {
  IWikipediaExtractsParser,
  WikipediaExtractsParser,
} from "./wikipediaExtractsParser.ts";
import {
  IWikipediaExtractsWriter,
  WikipediaExtractsWriter,
} from "./wikipediaExtractsWriter.ts";
import {
  IWikipediaExtractsSelector,
  WikipediaExtractsSelector,
} from "./wikipediaExtractsSelector.js";

export interface IWikipediaExtractsRepository {
  readonly write: IWikipediaExtractsWriter;
  readonly select: IWikipediaExtractsSelector;
}

export class WikipediaExtractsRepository implements IWikipediaExtractsRepository {
  private readonly parser: IWikipediaExtractsParser;
  public readonly write: IWikipediaExtractsWriter;
  public readonly select: IWikipediaExtractsSelector;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.parser = new WikipediaExtractsParser();
    this.write = new WikipediaExtractsWriter(this.db, this.parser);
    this.select = new WikipediaExtractsSelector(this.db, this.parser);
  }
}
