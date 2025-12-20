import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import Avatar from "./Avatar";
import Author from "./Author";
import PostContent from "./PostContent";
import React from "react";
import type { BSPostProps } from "@/env";
import { BSPostFooter } from "./BSPostFooter";

function BSPost({ post, choosePost, inPopover }: BSPostProps): JSX.Element {
  const selected = useSelector((state: RootState) => state.bluesky.selected)
  const text: string = post.record?.text ?? null;
  const dynamicHandler = inPopover
    ? {}
    : {
      onClick: choosePost(post)
    };

  return (
    <div
      className={`relative rounded-3xl shadow-inset my-8 
        md:hover:bg-white/15 transition-colors duration-200 ease-soft
        py-2 px-2  lg:p-6 ring-1 ring-white/5 cursor-pointer flex flex-col gap-y-2
        ${(text === selected) || (inPopover)
          ? 'bg-white shadow-material z-40 pointer-events-none'
          : 'pointer-events-auto bg-white/5'}
        `}
      {...dynamicHandler}
    >
      <figcaption className={`relative flex flex-row items-center gap-2 pb-6 border-b 
        ${text === selected
          ? 'border-black/10'
          : 'border-white/10'}`
      }
      >
        <Avatar
          src={post.author?.avatar}
        />
        <Author
          post={post}
        />
      </figcaption>
      <figure>
        <PostContent
          text={text}
        />
      </figure>
      <BSPostFooter
        likeCount={post.likeCount}
        text={post?.record?.text}
        selected={selected}
      />
    </div>
  );
};


export default React.memo(BSPost);