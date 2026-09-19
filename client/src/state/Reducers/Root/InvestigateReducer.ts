import { combineReducers } from "@reduxjs/toolkit";
import type { UnknownAction } from "@reduxjs/toolkit";
import StepsReducer from "../Investigate/pov/Steps";
import UserPOVReducer from "../Investigate/pov/UserPOV";
import NoteReducer from "../Investigate/articles/NoteTaking";
import ReadingReducer from "../Investigate/articles/ExtractedArticles";
import SelectingArticles from "../Investigate/articles/ChosenArticles";
import SearchResults from "../Investigate/articles/SearchResults";
import ReviewReducer from "../Investigate/pov/Review";
import HelpReducer from "../Investigate/help/HelpModal";
import RenderingSlice from "../Investigate/Rendering";
import WikipediaExtractSlice from "../Investigate/wiki/WikiSlice";

export const CLEAR_INVESTIGATION = "investigation/clear" as const;

const investigateReducer = combineReducers({
  stepper: StepsReducer,
  pov: UserPOVReducer,
  notes: NoteReducer,
  read: ReadingReducer,
  getArticle: SelectingArticles,
  search: SearchResults,
  review: ReviewReducer,
  help: HelpReducer,
  wiki: WikipediaExtractSlice,
  rendering: RenderingSlice,
});

export type InvestigateState = ReturnType<typeof investigateReducer>;

export const InvestigateFeature = (
  state: InvestigateState | undefined,
  action: UnknownAction,
) => {
  switch (action.type) {
    case CLEAR_INVESTIGATION:
      return investigateReducer(undefined, action);

    default:
      return investigateReducer(state, action);
  }
};
