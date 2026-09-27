import dashboardReducer, { clearDashboardSlice } from "../../state/Reducers/Dashboard/DashboardSlice";
import { hydrateBookmarkRecords } from "../../state/Reducers/Dashboard/thunks";

jest.mock("../../lib/services/client/serverClient", () => ({ serverClient: {} }));

const records = [{
  id: "bookmark-1", article_id: 42, user_id: "user-1",
  created_at: "2026-09-27", updated_at: null,
}];

describe("shared bookmark hydration", () => {
  test("ignores older success and failure while a newer request is pending", () => {
    let state = dashboardReducer(undefined, hydrateBookmarkRecords.pending("older", undefined));
    state = dashboardReducer(state, hydrateBookmarkRecords.pending("newer", undefined));
    expect(dashboardReducer(state, hydrateBookmarkRecords.fulfilled(records, "older", undefined))).toEqual(state);
    expect(dashboardReducer(state, hydrateBookmarkRecords.rejected(new Error("old failure"), "older", undefined))).toEqual(state);
    state = dashboardReducer(state, hydrateBookmarkRecords.fulfilled(records, "newer", undefined));
    expect(state.bookmarkRequestId).toBeNull();
    expect(state.bookmarks).toEqual({ status: "ready", data: records });
    expect(dashboardReducer(state, hydrateBookmarkRecords.fulfilled([], "older", undefined))).toEqual(state);
  });

  test("ignores late success and failure after reset", () => {
    let state = dashboardReducer(undefined, hydrateBookmarkRecords.pending("request", undefined));
    state = dashboardReducer(state, clearDashboardSlice());
    expect(state.bookmarkRequestId).toBeNull();
    expect(dashboardReducer(state, hydrateBookmarkRecords.fulfilled(records, "request", undefined))).toEqual(state);
    expect(dashboardReducer(state, hydrateBookmarkRecords.rejected(new Error("late failure"), "request", undefined))).toEqual(state);
  });

  test("accepts the current failure and clears its request ID", () => {
    let state = dashboardReducer(undefined, hydrateBookmarkRecords.pending("request", undefined));
    state = dashboardReducer(state, hydrateBookmarkRecords.rejected(new Error("failed"), "request", undefined));
    expect(state.bookmarkRequestId).toBeNull();
    expect((state.bookmarks).status).toBe("failed");
  });
});
