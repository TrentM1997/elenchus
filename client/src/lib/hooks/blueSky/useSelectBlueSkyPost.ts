import { useDispatch } from "react-redux";
import { updatePOVDraft } from "@/state/Reducers/Investigate/pov/thunks";
import { smoothScrollUp } from "@/lib/helpers/scroll/ScrollToTop";
import { renderModal } from "@/state/Reducers/RenderingPipelines/PipelineSlice";
import { AppDispatch } from "@/state/store";
import { BlueSkyPostSchemaType } from "@elenchus/contracts/schemas/integrations/BlueSkySchemas";
import { selectPost } from "@/state/Reducers/BlueSky/BlueSkySlice";

export const useSelectBlueSkyPost = (post: BlueSkyPostSchemaType) => {
  const dispatch = useDispatch<AppDispatch>();

  const investigateThis = () => {
    dispatch(updatePOVDraft({ idea: post.record.text }));
    dispatch(renderModal(null));
    smoothScrollUp();
  };

  const unselect = () => {
    dispatch(renderModal(null));
    dispatch(selectPost({ status: "initial" }));
  };

  return {
    investigateThis,
    unselect,
  };
};
