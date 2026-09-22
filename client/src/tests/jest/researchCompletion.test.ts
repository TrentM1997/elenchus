import { configureStore } from "@reduxjs/toolkit";
import researchReducer, {
  startFraming, startSearching, startEvidence, startReflection,
  updateReflection, completeResearch,
} from "../../state/Reducers/Investigate/research/ResearchSlice";
import saveReducer, { saveUserInvestigation } from "../../state/Reducers/Dashboard/UserContent/SaveInvestigationSlice";
import { serverClient } from "../../lib/services/client/serverClient";

jest.mock("../../lib/services/client/serverClient", () => ({
  serverClient: { privileged: { user: { write: { investigation: jest.fn() } } } },
}));

const createWorkflow = () => {
  const store = configureStore({ reducer: { research: researchReducer, save: saveReducer } });
  store.dispatch(startFraming({ idea: "An idea", initial_perspective: "Agree", expertise: "Familiar" }));
  store.dispatch(startSearching());
  store.dispatch(startEvidence({ sources: ["https://example.com/article"], wikipedia_extracts: [] }));
  store.dispatch(startReflection({ ending_perspective: null, takeaway: null }));
  return store;
};

beforeEach(() => jest.resetAllMocks());

test("reflection and takeaway survive completion and are sent with framing and sources", async () => {
  const store = createWorkflow();
  store.dispatch(updateReflection({
    ending_perspective: "Disagree", changed_opinion: true, had_merit: false,
    new_concepts: true, takeaway: "The evidence changed my view",
  }));
  store.dispatch(completeResearch());
  const research = store.getState().research.research;
  if (research.phase !== "completed") throw new Error("Expected completed research");
  const { framing, context, reflection } = research.data;
  const payload = { ...framing, ...context, ...reflection };
  const saved = { ...payload, id: 23, created_at: "2026-09-21" };
  jest.mocked(serverClient.privileged.user.write.investigation).mockResolvedValue({ ok: true, data: saved });
  const result = await store.dispatch(saveUserInvestigation(payload));
  expect(saveUserInvestigation.fulfilled.match(result)).toBe(true);
  expect(serverClient.privileged.user.write.investigation).toHaveBeenCalledWith(expect.objectContaining({
    expertise: "Familiar", initial_perspective: "Agree", ending_perspective: "Disagree",
    sources: ["https://example.com/article"], takeaway: "The evidence changed my view",
  }));
  expect(store.getState().save.saved).toBe(true);
});

test("skipping the takeaway preserves null on completion", () => {
  const store = createWorkflow();
  store.dispatch(completeResearch());
  expect(store.getState().research.research).toMatchObject({
    phase: "completed", data: { reflection: { takeaway: null } },
  });
});

test("persistence failures reject with a serializable message without marking saved", async () => {
  const store = createWorkflow();
  jest.mocked(serverClient.privileged.user.write.investigation).mockResolvedValue({ ok: false, message: "Save failed" });
  const result = await store.dispatch(saveUserInvestigation({
    idea: "An idea", expertise: null, initial_perspective: null, ending_perspective: null,
  }));
  expect(saveUserInvestigation.rejected.match(result)).toBe(true);
  expect(result.payload).toBe("Save failed");
  expect(store.getState().save.saved).toBe(false);
});
