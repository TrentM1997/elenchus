import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrowsingOptionSchemaType } from "@elenchus/contracts/schemas/articles/BrowsingOptionSchema";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

const MAX = 3;
const MIN = 0;

export type SelectedArticles =
  | { status: "empty" }
  | {
      status: "partial";
      data: BrowsingOptionSchemaType[];
    }
  | {
      status: "max";
      data: BrowsingOptionSchemaType[];
    };

interface InitialState {
  selected: SelectedArticles;
  showMaxToast: boolean;
}

const initialState: InitialState = {
  selected: { status: "empty" },
  showMaxToast: false,
};

export const ArticlesSlice = createSlice({
  name: "chosenArticles",
  initialState: initialState,
  reducers: {
    choose: (
      state: InitialState,
      action: PayloadAction<BrowsingOptionSchemaType>,
    ) => {
      switch (state.selected.status) {
        case "empty": {
          state.selected = {
            status: "partial",
            data: [action.payload],
          };
          return;
        }

        case "partial": {
          const current = state.selected.data;

          if (current.some((article) => article.url === action.payload.url)) {
            return;
          }
          const data = [action.payload, ...current];
          state.selected = {
            status: data.length >= MAX ? "max" : "partial",
            data,
          };
          return;
        }

        case "max":
          return;

        default:
          return assertNever(state.selected);
      }
    },
    discard: (
      state: InitialState,
      action: PayloadAction<BrowsingOptionSchemaType>,
    ) => {
      switch (state.selected.status) {
        case "empty":
          return;

        case "partial":
        case "max": {
          const data = state.selected.data.filter(
            (article) => article.url !== action.payload.url,
          );
          state.selected =
            data.length === 0
              ? { status: "empty" }
              : {
                  status: data.length >= MAX ? "max" : "partial",
                  data,
                };
          return;
        }

        default:
          return assertNever(state.selected);
      }
    },
    openMaxtoast: (state, action) => {
      state.showMaxToast = action.payload;
    },
    clearChosenArticles: () => {
      return initialState;
    },
  },
});

export const { choose, discard, clearChosenArticles, openMaxtoast } =
  ArticlesSlice.actions;

export default ArticlesSlice.reducer;
