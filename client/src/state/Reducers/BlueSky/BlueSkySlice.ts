import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { hydrateFeed } from "./thunks";
import {
  BlueSkyPosts,
  Dimensions,
  PopoverPost,
  PopoverXY,
  SelectedPost,
} from "./types";

interface InitialState {
  fadeOutHomePage: boolean;
  posts: BlueSkyPosts;
  selected: SelectedPost;
  popoverPost: PopoverPost;
  popoverPosition: PopoverXY;
  containerDimensions: Dimensions;
}

const initialState: InitialState = {
  fadeOutHomePage: false,
  posts: { status: "initial" },
  selected: { status: "initial" },
  popoverPost: { status: "initial" },
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
    getPopoverPosition: (state, action: PayloadAction<PopoverXY>) => {
      const coordinates = action.payload;
      state.popoverPosition.x = coordinates.x;
      state.popoverPosition.y = coordinates.y;
    },
    getPopoverPost: (state, action: PayloadAction<PopoverPost>) => {
      state.popoverPost = action.payload;
    },
    landingPageFadeOut: (state, action: PayloadAction<boolean>) => {
      state.fadeOutHomePage = action.payload;
    },
    resetBlueSkyState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(hydrateFeed.pending, (state) => {
      state.posts = { status: "pending" };
    });
    builder.addCase(hydrateFeed.rejected, (state, action) => {
      state.posts = {
        status: "failed",
        details: "Blue sky feed hydration failed",
      };
      builder.addCase(hydrateFeed.fulfilled, (state, action) => {
        state.posts = { status: "ready", data: action.payload };
      });
    });
  },
});

export const {
  resetBlueSkyState,
  selectPost,
  getStoredPosts,
  getPopoverPosition,
  getPopoverPost,
  landingPageFadeOut,
} = BlueSkySlice.actions;

export default BlueSkySlice.reducer;
