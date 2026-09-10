import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../types/databaseInterfaces";
import {
  IUserRepository,
  UserRepository,
} from "../repositories/user/userRepository";
import {
  IArticlesRepository,
  ArticlesRepository,
} from "../repositories/articles/articlesRepository";
import {
  IInvestigationsRepository,
  InvestigationsRepository,
} from "../repositories/investigations/investigationsRepository";
import { SourcesRepository } from "../repositories/sources/sourcesRepository";

export interface IDbClient {
  readonly user: IUserRepository;
  readonly articles: IArticlesRepository;
  readonly investigations: IInvestigationsRepository;
  readonly sources: SourcesRepository;
}

export class DbClient implements IDbClient {
  public readonly user: IUserRepository;
  public readonly articles: IArticlesRepository;
  public readonly investigations: IInvestigationsRepository;
  public readonly sources: SourcesRepository;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.user = new UserRepository(this.db);
    this.articles = new ArticlesRepository(this.db);
    this.investigations = new InvestigationsRepository(this.db);
    this.sources = new SourcesRepository(this.db);
  }
}
