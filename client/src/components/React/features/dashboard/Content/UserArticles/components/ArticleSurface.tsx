import { BookmarkStates } from "@/hooks/dashboard/useBookmarkSavedArticles";
import ArticleSaved from "./ArticleSaved";
import ArticleThumbnail from "./ArticleThumbnail";
import Title from "./Title";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

interface ArticleSurface {
  article: ArticleSchemaType;
  select: (article: ArticleSchemaType) => () => Promise<void>;
  bookmarks: BookmarkStates;
  index: number;
  fastScroll: boolean;
  deleteBookmark: (article: ArticleSchemaType) => () => Promise<void>;
}

export default function ArticleSurface({
  article,
  select,
  bookmarks,
  index,
  fastScroll,
  deleteBookmark,
}: ArticleSurface) {
  return (
    <ArticleSaved>
      <Title article={article} handleArticleSelection={select} />
      <ArticleThumbnail
        bookmark={bookmarks[article.id]}
        isPriority={index <= 5}
        fastScroll={fastScroll}
        article={article}
        deleteHandler={deleteBookmark}
      />
    </ArticleSaved>
  );
}
