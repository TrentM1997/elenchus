import { combineReducers } from "@reduxjs/toolkit";
import type { UnknownAction } from "@reduxjs/toolkit";
import StepsReducer from "../Investigate/Steps";
import UserPOVReducer from "../Investigate/pov/UserPOV";
import NoteReducer from "../Investigate/NoteTaking";
import ReadingReducer from "../Investigate/articles/ExtractedArticles";
import SelectingArticles from "../Investigate/articles/ChosenArticles";
import SearchResults from "../Investigate/articles/SearchResults";
import ReviewReducer from "../Investigate/Review";
import HelpReducer from "../Investigate/HelpModal";
import EndInvestigateReducer from "../Investigate/EndInvestigation";
import WikipediaSlice from "../Investigate/WikipediaSlice";
import RenderingSlice from "../Investigate/Rendering";

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
  end: EndInvestigateReducer,
  wiki: WikipediaSlice,
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
