import { configureStore } from "@reduxjs/toolkit";
import reducer, {
  clearOpenedInvestigation,
} from "../../state/Reducers/Dashboard/DashboardSlice";
import { hydrateOpenInvestigation } from "../../state/Reducers/Dashboard/thunks";
import { serverClient } from "../../lib/services/client/serverClient";

jest.mock("../../lib/services/client/serverClient", () => ({
  serverClient: {
    privileged: { user: { select: { investigations: { byId: jest.fn() } } } },
  },
}));

const investigation = {
  id: 34,
  created_at: "2026-09-22",
  idea: "Question",
  initial_perspective: null,
  ending_perspective: null,
  expertise: null,
};
const data = { investigation, sources: [], extracts: [] };
const response = {
  ok: true as const,
  data,
};
const byId = jest.mocked(serverClient.privileged.user.select.investigations.byId);

beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test("successful hydration exposes all three pieces together, including empty collections", async () => {
  const store = configureStore({ reducer });
  byId.mockResolvedValueOnce(response);

  const request = store.dispatch(hydrateOpenInvestigation(investigation.id));
  expect(store.getState().openInvestigation).toEqual({ status: "pending" });

  const action = await request;
  expect(hydrateOpenInvestigation.fulfilled.match(action)).toBe(true);
  expect(byId).toHaveBeenCalledWith(investigation.id, expect.any(AbortSignal));
  expect(store.getState().openInvestigation).toEqual({ status: "ready", data });
});

test.each(["investigation", "sources", "extracts"] as const)(
  "a %s failure rejects the whole investigation and preserves the failure details",
  async (section) => {
    const store = configureStore({ reducer });
    store.dispatch(hydrateOpenInvestigation.fulfilled(data, "previous", investigation.id));
    const message = `Could not load ${section}`;
    const details = `${section} service unavailable`;
    byId.mockResolvedValueOnce({
      ok: false,
      message,
      details,
    });

    const request = store.dispatch(hydrateOpenInvestigation(investigation.id));
    expect(store.getState().openInvestigation).toEqual({ status: "pending" });

    const action = await request;
    expect(hydrateOpenInvestigation.rejected.match(action)).toBe(true);
    expect(action.payload).toEqual(expect.stringContaining(message));
    expect(action.payload).toEqual(expect.stringContaining(details));
    expect(store.getState().openInvestigation).toEqual({
      status: "failed",
      details: action.payload,
    });
  },
);

test("a request error fails hydration without retaining previous investigation data", async () => {
  const store = configureStore({ reducer });
  store.dispatch(hydrateOpenInvestigation.fulfilled(data, "previous", investigation.id));
  byId.mockRejectedValueOnce(new Error("Network unavailable"));

  await store.dispatch(hydrateOpenInvestigation(investigation.id));

  expect(store.getState().openInvestigation).toEqual({
    status: "failed",
    details: "Network unavailable",
  });
});

test("clearing an opened investigation resets the entire state", () => {
  const ready = reducer(
    undefined,
    hydrateOpenInvestigation.fulfilled(data, "open", investigation.id),
  );
  expect(reducer(ready, clearOpenedInvestigation()).openInvestigation).toEqual({
    status: "initial",
  });
});
