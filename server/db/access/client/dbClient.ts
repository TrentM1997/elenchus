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
import { SourcesRepository } from "../repositories/sources/sourcesRepository.js";
import {
  IBookmarksRepository,
  BookmarksRepository,
} from "../repositories/bookmarks/bookmarksRepository.js";
import {
  IFeedbackRespository,
  FeedbackRepository,
} from "../repositories/feedback/feedbackRespository.js";

export interface IDbClient {
  readonly user: IUserRepository;
  readonly articles: IArticlesRepository;
  readonly investigations: IInvestigationsRepository;
  readonly sources: SourcesRepository;
  readonly bookmarks: IBookmarksRepository;
  readonly feedback: IFeedbackRespository;
}

export class DbClient implements IDbClient {
  public readonly feedback: IFeedbackRespository;
  public readonly user: IUserRepository;
  public readonly articles: IArticlesRepository;
  public readonly investigations: IInvestigationsRepository;
  public readonly sources: SourcesRepository;
  public readonly bookmarks: IBookmarksRepository;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.user = new UserRepository();
    this.feedback = new FeedbackRepository(this.db);
    this.articles = new ArticlesRepository(this.db);
    this.investigations = new InvestigationsRepository(this.db);
    this.sources = new SourcesRepository(this.db);
    this.bookmarks = new BookmarksRepository(this.db);
  }
}
