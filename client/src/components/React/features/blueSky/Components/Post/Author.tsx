import { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import { limitName } from "@/lib/helpers/formatting/Presentation";
import { BlueSkyPostSchemaType } from "@elenchus/contracts/schemas/integrations/BlueSkySchemas";

export default function Author({
  post,
}: {
  post: BlueSkyPostSchemaType;
}): React.ReactNode {
  const selected = useSelector((state: RootState) => state.bluesky.selected);
  const handle: string = limitName(post.author.handle);

  if (selected.status !== "ready") return null;

  return (
    <div className="flex flex-col items-center h-full">
      <div
        className={`text-base font-light leading-6 w-full h-auto ${post.cid === selected.data.cid ? "text-black" : "text-white"}`}
      >
        {post.author.displayName}
      </div>
      <div
        className={`text-xs font-light leading-6 w-full h-auto ${post.cid === selected.data.cid ? "text-black" : "text-white"}`}
      >
        <em>@{handle}</em>
      </div>
    </div>
  );
}
