import React, { type JSX } from "react";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

interface SourceMetaDataProps {
  title: ArticleSchemaType["title"];
  authors: ArticleSchemaType["authors"];
  date: ArticleSchemaType["date_published"];
  provider: ArticleSchemaType["provider"];
  handleArticleSelection: () => void;
}

function SourceMetaData({
  title,
  authors,
  date,
  provider,
  handleArticleSelection,
}: SourceMetaDataProps): JSX.Element {
  return (
    <div className="group" onClick={handleArticleSelection}>
      <h3 className="text-3xl mt-6 tracking-tight font-light md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl text-white/80 md:group-hover:text-white transition-all duration-200 ease-in-out">
        {title}
      </h3>
      <p className="text-zinc-400 text-xs mt-6">
        {authors ? authors[0] : "Authors not available"} -{" "}
        <span>
          {" "}
          <time
            className="text-zinc-400 md:group-hover:text-blue-400 transition-all ease-in-out duration-200"
            dateTime={date}
          >
            {date}
          </time>
        </span>
      </p>
      <p className="text-zinc-400 text-xs mt-6">
        Published by -{" "}
        <span className="text-zinc-400 md:group-hover:text-blue-400 transition-all ease-in-out duration-200">
          {provider}{" "}
        </span>
      </p>
    </div>
  );
}

export default React.memo(SourceMetaData);
