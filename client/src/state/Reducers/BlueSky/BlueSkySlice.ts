import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { hydrateFeed, searchBlueSky } from "./thunks";
import {
  BlueSkyPosts,
  Dimensions,
  PopoverPost,
  PopoverXY,
  SelectedPost,
} from "./types";
import { SplitBlueSkyFeedSchemaType } from "@elenchus/contracts/schemas/integrations/BlueSkySchemas";

interface InitialState {
  fadeOutHomePage: boolean;
  posts: BlueSkyPosts;
  selected: SelectedPost;
  popoverPosition: PopoverXY;
  containerDimensions: Dimensions;
}

const initialState: InitialState = {
  fadeOutHomePage: false,
  posts: { status: "initial" },
  selected: { status: "initial" },
  containerDimensions: {
    w: null,
    h: null,
  },
  popoverPosition: {
    x: null,
    y: null,
  },
};

export const BlueSkySlice = createSlice({
  name: "blueSkyPosts",
  initialState: initialState,
  reducers: {
    selectPost: (state, action: PayloadAction<SelectedPost>) => {
      state.selected = action.payload;
    },
    getStoredPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    getBlueSkyPosts: (
      state: InitialState,
      action: PayloadAction<BlueSkyPosts>,
    ) => {
      state.posts = action.payload;
    },
    getPopoverPosition: (state, action: PayloadAction<PopoverXY>) => {
      const coordinates = action.payload;
      state.popoverPosition.x = coordinates.x;
      state.popoverPosition.y = coordinates.y;
    },
    landingPageFadeOut: (state, action: PayloadAction<boolean>) => {
      state.fadeOutHomePage = action.payload;
    },
    resetBlueSkyState: () => initialState,
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

export const {
  resetBlueSkyState,
  selectPost,
  getStoredPosts,
  getPopoverPosition,
  landingPageFadeOut,
  getBlueSkyPosts,
} = BlueSkySlice.actions;

export default BlueSkySlice.reducer;
