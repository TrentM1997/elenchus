import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { hydrateFeed, searchBlueSky } from "./thunks";
import type { BlueSkyPosts, SelectedPost } from "./types";
import type { SplitBlueSkyFeedSchemaType } from "@elenchus/contracts/schemas/integrations/BlueSkySchemas";

interface InitialState {
  posts: BlueSkyPosts;
  selected: SelectedPost;
}

const initialState: InitialState = {
  posts: { status: "initial" },
  selected: { status: "initial" },
};

export const BlueSkySlice = createSlice({
  name: "blueSkyPosts",
  initialState: initialState,
  reducers: {
    selectPost: (state, action: PayloadAction<SelectedPost>) => {
      state.selected = action.payload;
    },
    getBlueSkyPosts: (
      state: InitialState,
      action: PayloadAction<BlueSkyPosts>,
    ) => {
      state.posts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchBlueSky.pending, (state) => {
      state.posts = { status: "pending" };
    });

    builder.addCase(searchBlueSky.rejected, (state) => {
      state.posts = {
        status: "failed",
        details: "Failed to retrieve searched posts",
      };
    });

    builder.addCase(
      searchBlueSky.fulfilled,
      (state, action: PayloadAction<SplitBlueSkyFeedSchemaType>) => {
        const result = action.payload;
        if (result.firstHalf.length === 0) {
          state.posts = {
            status: "empty",
            message: "Search yielded 0 results",
          };
        } else {
          state.posts = { status: "ready", data: result };
        }
      },
    );

    builder.addCase(hydrateFeed.pending, (state) => {
      state.posts = { status: "pending" };
    });

    builder.addCase(hydrateFeed.rejected, (state) => {
      state.posts = {
        status: "failed",
        details: "Blue sky feed hydration failed",
      };
    });

    builder.addCase(hydrateFeed.fulfilled, (state, action) => {
      state.posts = {
        status: "ready",
        data: {
          firstHalf: action.payload.firstHalf,
          secondHalf: action.payload.secondHalf,
        },
      };
    });
  },
});

export const { selectPost, getBlueSkyPosts } = BlueSkySlice.actions;

export default BlueSkySlice.reducer;
