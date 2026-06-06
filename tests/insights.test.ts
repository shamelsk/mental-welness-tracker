import { describe, expect, it } from "vitest";

import { sampleData } from "../data/sample";
import { buildInsights, burnoutRisk, chartSeries, coachFallback, triggerCounts, wellnessScore } from "../lib/insights";
import { daysBetween } from "../lib/utils";

describe("insight helpers", () => {
  it("computes the sample wellness score", () => {
    expect(wellnessScore(sampleData)).toBe(47);
  });

  it("derives the burnout risk for the sample data", () => {
    expect(burnoutRisk(sampleData)).toEqual({
      level: "Moderate Risk",
      score: 94,
      message: "Some warning signs are showing. Add sleep protection and a short recovery block."
    });
  });

  it("builds the expected insight set", () => {
    expect(buildInsights(sampleData).map((insight) => insight.title)).toEqual([
      "Sleep is a strong signal",
      "Journaling helps",
      "Most common trigger",
      "Mock test pattern"
    ]);
  });

  it("counts repeated triggers across mood entries", () => {
    expect(triggerCounts(sampleData.moodEntries)).toMatchObject({
      "mock test fear": 1,
      "poor scores": 1,
      "lack of revision": 1,
      "syllabus overload": 1,
      "time management": 1,
      procrastination: 1
    });
  });

  it("creates chart data from the latest mood entries", () => {
    expect(chartSeries(sampleData.moodEntries)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ mood: 3, stress: 8, sleep: 5.5, energy: 4, wellness: 28 })
      ])
    );
    expect(chartSeries(sampleData.moodEntries)).toHaveLength(5);
  });

  it("returns the crisis response for urgent language", () => {
    const response = coachFallback(sampleData, "I can't go on anymore.");

    expect(response).toContain("contact local emergency services now");
    expect(response).toContain("tell a trusted person near you immediately");
  });

  it("keeps the date helper predictable", () => {
    expect(daysBetween(new Date("2026-06-01T00:00:00.000Z"), new Date("2026-06-06T00:00:00.000Z"))).toBe(5);
  });
});