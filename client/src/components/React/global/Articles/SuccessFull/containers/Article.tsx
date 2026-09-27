import { UserKind } from "@/state/Reducers/Athentication/Authentication";
import ArticleHeader from "../components/hero/containers/ArticleHeader";
import ArticleContent from "../components/text/ArticleContent";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

type ArticleProps = {
  articleData: ArticleSchemaType;
  userKind: UserKind;
  bookmarked: boolean;
};

export default function Article({
  articleData,
  userKind,
  bookmarked,
}: ArticleProps): JSX.Element | null {
  if (!articleData) return null;

  return (
    <div
      className="relative top-0 left-0 right-0 flex flex-col grow  mx-auto opacity-0
          animate-fade-blur animation-delay-200ms
                 w-full lg:max-w-2xl xl:max-w-5xl min-h-screen scrollbar-hide
                 bg-black"
    >
      <div className="relative">
        <ArticleHeader
          bookmarked={bookmarked}
          articleData={articleData}
          userKind={userKind}
        />
        <ArticleContent
          article_text={articleData.full_text}
          article_url={articleData.article_url}
        />
      </div>
    </div>
  );
}
