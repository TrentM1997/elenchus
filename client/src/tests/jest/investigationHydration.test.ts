import reducer from "../../state/Reducers/Dashboard/DashboardSlice";
import { hydrateOpenInvestigation } from "../../state/Reducers/Dashboard/thunks";

jest.mock("../../lib/services/client/serverClient", () => ({ serverClient: {} }));

const investigation = {
  id: 34,
  created_at: "2026-09-22",
  idea: "Question",
  initial_perspective: null,
  ending_perspective: null,
  expertise: null,
};

test("a source failure leaves the investigation readable and ends source loading", () => {
  const pending = reducer(
    undefined,
    hydrateOpenInvestigation.pending("open", investigation.id),
  );
  const state = reducer(
    pending,
    hydrateOpenInvestigation.fulfilled(
      {
        investigation: { ok: true, data: investigation },
        sources: { ok: false, message: "Could not load sources" },
      },
      "open",
      investigation.id,
    ),
  );

  expect(state.openInvestigation).toEqual({
    investigation: { status: "ready", data: investigation },
    sources: { status: "failed", details: "Could not load sources" },
  });
});

test("successful hydration still makes both sections ready", () => {
  const pending = reducer(
    undefined,
    hydrateOpenInvestigation.pending("open", investigation.id),
  );
  const state = reducer(
    pending,
    hydrateOpenInvestigation.fulfilled(
      {
        investigation: { ok: true, data: investigation },
        sources: { ok: true, data: [] },
      },
      "open",
      investigation.id,
    ),
  );

  expect(state.openInvestigation).toEqual({
    investigation: { status: "ready", data: investigation },
    sources: { status: "ready", data: [] },
  });
});
