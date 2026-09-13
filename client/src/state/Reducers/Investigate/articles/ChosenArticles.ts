import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedArticle } from "@/env";

export type SelectedArticles =
  | { status: "empty" }
  | {
      status: "partial";
      data: SelectedArticle[];
    }
  | {
      status: "max";
      data: SelectedArticle[];
    };

interface InitialState {
  selected: SelectedArticles;
  showMaxToast: boolean;
}

const initialState: InitialState = {
  selected: { status: "empty" },
  showMaxToast: false,
};

function getStatusFromRemove(
  currentLength: number,
): SelectedArticles["status"] {
  if (currentLength - 1 === 0) {
    return "empty";
  } else {
    return "partial";
  }
}

export const ArticlesSlice = createSlice({
  name: "chosenArticles",
  initialState: initialState,
  reducers: {
    choose: (state: InitialState, action: PayloadAction<SelectedArticle>) => {
      if (state.selected.status === "empty") {
        state.selected = { status: "partial", data: [action.payload] };
      } else {
        const currentUrls = state.selected.data.map((art) => art.url);
        const set = new Set([...currentUrls]);

        if (set.has(action.payload.url)) {
          const filtered = state.selected.data.filter(
            (art) => art.url !== action.payload.url,
          );

          if (state.selected.data.length > 1) {
            state.selected = { status: "partial", data: filtered };
            return;
          } else {
            state.selected = { status: "empty" };
            return;
          }
        }

        if (state.selected.status === "max") {
          return;
        }

        if (state.selected.status === "partial") {
          if (state.selected.data.length === 2) {
            const temp = state.selected.data;
            temp.push(action.payload);
            state.selected = {
              status: "max",
              data: temp,
            };
          }
        }
      }
    },
    discard: (
      state: InitialState,
      action: PayloadAction<SelectedArticle["url"]>,
    ) => {
      const urlToRemove = action.payload;

      switch (state.selected.status) {
        case "partial":
        case "max": {
          const current = state.selected.data;
          const filtered = current.filter(
            (selected: SelectedArticle) => selected.url !== urlToRemove,
          );
          if (current.length - 1 > 0) {
            state.selected = {
              status: "partial",
              data: filtered,
            };
          } else {
            state.selected = { status: "empty" };
          }
        }
        default: {
          return;
        }
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

export type ChosenArticleSlice = ReturnType<typeof ArticlesSlice.reducer>;

export const { choose, discard, clearChosenArticles, openMaxtoast } =
  ArticlesSlice.actions;

export default ArticlesSlice.reducer;
