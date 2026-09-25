import { resolveRestoreIndex } from "../../lib/helpers/scroll/resolveRestoreIndex";

const resolve = (
  ids: Array<string | number>,
  position?: { listID?: string; topKey: string | number | null; topIndex: number | null },
) => resolveRestoreIndex({
  items: ids.map(id => ({ id })),
  listId: "articles",
  restorePosition: position,
  getKey: item => item.id,
});

test("follows the saved item after reorder instead of its old index", () => {
  expect(resolve([30, 10, 20], { listID: "articles", topKey: 20, topIndex: 0 })).toBe(2);
});

test("supports string keys and a saved first item", () => {
  expect(resolve(["a", "b"], { listID: "articles", topKey: "a", topIndex: 1 })).toBe(0);
});

test("clamps the fallback when the saved item was deleted", () => {
  expect(resolve([10, 20], { listID: "articles", topKey: 30, topIndex: 5 })).toBe(1);
  expect(resolve([10, 20], { listID: "articles", topKey: null, topIndex: -1 })).toBe(0);
});

test("does not restore another list or an empty list", () => {
  expect(resolve([10], { listID: "investigations", topKey: 10, topIndex: 0 })).toBeNull();
  expect(resolve([], { listID: "articles", topKey: 10, topIndex: 0 })).toBeNull();
  expect(resolve([10])).toBeNull();
});
