import test from "node:test";
import assert from "node:assert/strict";
import { SourcesRepository } from "../dist/db/access/repositories/sources/sourcesRepository.js";

test("invalid source ratings fall back without losing valid source ratings", async () => {
  const valid = {
    name: "Valid Source",
    country: "United States",
    bias: "Least Biased",
    factual_reporting: "High",
  };
  const db = {
    from() {
      let pattern;
      return {
        select() { return this; },
        ilike(_column, value) { pattern = value; return this; },
        limit() { return this; },
        async single() {
          return {
            data: pattern === "%Valid Source%"
              ? valid
              : { ...valid, factual_reporting: "unrecognized rating" },
            error: null,
          };
        },
      };
    },
  };

  const ratings = await new SourcesRepository(db).getBiases([
    { source: "Valid Source" },
    { source: "Invalid Source" },
  ]);

  assert.equal(ratings.size, 2);
  assert.equal(ratings.get("Valid Source").factual_reporting, "High");
  assert.equal(ratings.get("Valid Source").bias, "Least Biased");
  assert.deepEqual(ratings.get("Invalid Source"), {
    bias: "Unknown",
    factual_reporting: null,
    country: null,
  });
});
