import { createSlice } from "@reduxjs/toolkit";

export type InitialPerspective = "Agree" | "Disagree" | "Neutral" | null;

export type TopicExpertise =
  | "New to the Topic"
  | "Familiar"
  | "Area of Expertise"
  | null;

export interface UserPOVState {
  idea: string | null;
  perspective: InitialPerspective;
  expertise: TopicExpertise;
  biases: string | null;
  premises: string | null;
  searching: boolean | null;
  loading: boolean | null;
  showOptions: boolean;
}

const initialState: UserPOVState = {
  idea: null,
  perspective: null,
  expertise: null,
  biases: null,
  premises: null,
  searching: false,
  loading: false,
  showOptions: true,
};

export const UserPOVSlice = createSlice({
  name: "UserPOV",
  initialState: initialState,
  reducers: {
    getIdea: (state, action) => {
      state.idea = action.payload;
    },
    getPerspective: (state, action) => {
      state.perspective = action.payload;
    },
    getExpertise: (state, action) => {
      state.expertise = action.payload;
    },
    getBiases: (state, action) => {
      state.biases = action.payload;
    },
    getPremises: (state, action) => {
      state.premises = action.payload;
    },

    searchingArticles: (state, action) => {
      state.searching = action.payload;
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
    preselected: (state) => {
      state.showOptions = false;
    },
  },
});

export const {
  getIdea,
  getPerspective,
  getExpertise,
  getBiases,
  getPremises,
  searchingArticles,
  loading,
  preselected,
} = UserPOVSlice.actions;

export default UserPOVSlice.reducer;
