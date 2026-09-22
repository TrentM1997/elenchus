import { combineReducers, configureStore } from "@reduxjs/toolkit";
import reducer from "../../state/Reducers/Investigate/research/ResearchSlice";
import { establishPOV, updatePOVDraft } from "../../state/Reducers/Investigate/pov/thunks";
import { selectPOVData } from "../../state/Reducers/Investigate/pov/selectors";
import type { AppDispatch, RootState } from "../../state/store";

function createWorkflow() {
  const store = configureStore({
    reducer: { investigation: combineReducers({ research: reducer }) },
  });
  return {
    dispatch: store.dispatch as AppDispatch,
    getState: () => store.getState() as RootState,
  };
}

describe("perspective workflow", () => {
  test("editing each answer preserves the other answers", () => {
    const { dispatch, getState } = createWorkflow();
    dispatch(updatePOVDraft({ idea: "An idea worth looking into" }));
    dispatch(updatePOVDraft({ perspective: "Neutral" }));
    dispatch(updatePOVDraft({ expertise: "Familiar" }));
    dispatch(updatePOVDraft({ biases: "Don't have an opinion on the idea" }));
    dispatch(updatePOVDraft({ premises: "My starting assumptions" }));

    expect(getState().investigation.research.research.phase).toBe("framing");
    expect(selectPOVData(getState())).toEqual({
      idea: "An idea worth looking into",
      perspective: "Neutral",
      expertise: "Familiar",
      biases: "Don't have an opinion on the idea",
      premises: "My starting assumptions",
    });
  });

  test("an update created earlier merges with the latest answers", () => {
    const { dispatch, getState } = createWorkflow();
    const updateIdea = updatePOVDraft({ idea: "Text from the editor or Bluesky" });
    dispatch(updatePOVDraft({ perspective: "Agree", expertise: "Familiar" }));
    dispatch(updateIdea);

    expect(selectPOVData(getState())).toMatchObject({
      idea: "Text from the editor or Bluesky",
      perspective: "Agree",
      expertise: "Familiar",
    });
  });

  test("establishing the perspective preserves unanswered fields allowed by the model", () => {
    const { dispatch, getState } = createWorkflow();
    dispatch(updatePOVDraft({ idea: "An idea worth looking into" }));
    const draft = selectPOVData(getState());
    dispatch(establishPOV());

    expect(getState().investigation.research.research.phase).toBe("searching");
    expect(selectPOVData(getState())).toEqual(draft);
  });

  test("editing an established perspective preserves its phase and supports clearing text", () => {
    const { dispatch, getState } = createWorkflow();
    dispatch(updatePOVDraft({ idea: "An idea worth looking into", premises: "An assumption" }));
    dispatch(establishPOV());
    const established = selectPOVData(getState());
    dispatch(updatePOVDraft({ premises: "" }));

    expect(getState().investigation.research.research.phase).toBe("searching");
    expect(selectPOVData(getState())).toMatchObject({ idea: "An idea worth looking into", premises: "" });
    expect(established.premises).toBe("An assumption");
    dispatch(establishPOV());
    expect(getState().investigation.research.research.phase).toBe("searching");
  });
});

