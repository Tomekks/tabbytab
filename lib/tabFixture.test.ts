import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { groupNotesByStep, getStepOnsetTimes } from "./tabNotation.ts";

// Shared fixture (connection list, "hidden duplicate"): control-center keeps identical copies of both files
// and runs the same check against its own tab.ts. If the drawing rule changes on one side only, one check fails.
// Control Center previews only the first 30 s, so notes at or after 30 s are dropped here before grouping.
const PREVIEW_LIMIT_SEC = 30;

test("shared fixture: tab.sample.json groups into tab.expected-steps.json", () => {
  const read = (name: string) => JSON.parse(readFileSync(new URL(`../fixtures/${name}`, import.meta.url), "utf8"));
  const sample = read("tab.sample.json");
  const expected = read("tab.expected-steps.json");
  const notes = sample.notes.filter((n: { startTimeSec: number }) => n.startTimeSec < PREVIEW_LIMIT_SEC);
  const groups = groupNotesByStep(notes);
  const times = getStepOnsetTimes(notes);
  const got = groups.map((group, index) => ({ index, startTimeSec: times[index], notes: group }));
  assert.deepEqual(got, expected.steps);
  assert.equal(sample.tempoBpm, expected.tempoBpm);
  assert.deepEqual(sample.tuning, expected.tuning);
});
