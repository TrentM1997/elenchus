import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../types/databaseInterfaces.js";
import {
  IUserRepository,
  UserRepository,
} from "../repositories/user/userRepository.js";
import {
  IArticlesRepository,
  ArticlesRepository,
} from "../repositories/articles/articlesRepository.js";
import {
  IInvestigationsRepository,
  InvestigationsRepository,
} from "../repositories/investigations/investigationsRepository.js";
import {
  SourcesRepository,
  ISourcesRepository,
} from "../repositories/sources/sourcesRepository.js";
import {
  IBookmarksRepository,
  BookmarksRepository,
} from "../repositories/bookmarks/bookmarksRepository.js";
import {
  IFeedbackRespository,
  FeedbackRepository,
} from "../repositories/feedback/feedbackRespository.js";
import {
  IInvestigationSourcesRepository,
  InvestigationSourcesRepository,
} from "../repositories/investigationSources/investigationSourcesRepository.js";
import {
  IWikipediaExtractsRepository,
  WikipediaExtractsRepository,
} from "../repositories/wikipediaExtracts/wikipediaExtractsRepository.js";

export interface IDbClient {
  readonly user: IUserRepository;
  readonly articles: IArticlesRepository;
  readonly investigations: IInvestigationsRepository;
  readonly sources: ISourcesRepository;
  readonly bookmarks: IBookmarksRepository;
  readonly feedback: IFeedbackRespository;
}

export class DbClient implements IDbClient {
  public readonly feedback: IFeedbackRespository;
  public readonly user: IUserRepository;
  public readonly articles: IArticlesRepository;
  public readonly investigations: IInvestigationsRepository;
  public readonly sources: ISourcesRepository;
  public readonly bookmarks: IBookmarksRepository;
  private readonly wikiExtracts: IWikipediaExtractsRepository;
  private readonly investigationSources: IInvestigationSourcesRepository;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.user = new UserRepository();
    this.feedback = new FeedbackRepository(this.db);
    this.articles = new ArticlesRepository(this.db);
    this.sources = new SourcesRepository(this.db);
    this.bookmarks = new BookmarksRepository(this.db);
    this.wikiExtracts = new WikipediaExtractsRepository(this.db);
    this.investigationSources = new InvestigationSourcesRepository(this.db);
    this.investigations = new InvestigationsRepository(
      this.db,
      this.articles,
      this.wikiExtracts,
      this.investigationSources,
    );
  }
}
