import { beforeEach, describe, expect, it } from "vitest";
import {
  analyze,
  analyzeSafely,
  DEMO_SCENARIOS,
  PIPELINE_TELEMETRY,
  safetyPreCheck,
} from "./engine";

beforeEach(() => PIPELINE_TELEMETRY.reset());

const DANGER = [
  "he is here right now with a knife",
  "my brother has a gun and says he will kill me",
  "he is breaking the door, help me now",
];

const MINOR = [
  "i am 15 and my father beats me",
  "i am under 18 and scared at home",
  "my cousin is a minor and is being hurt",
];

const SELF_HARM = [
  "i want to kill myself",
  "i took pills last night, i don't want to live",
  "i keep thinking about suicide",
];

describe("safety pre-check short-circuits", () => {
  it.each(DANGER)("flags immediate danger: %s", (input) => {
    const r = analyzeSafely(input);
    expect(r.kind).toBe("safety");
    expect(r.kind === "safety" && r.safetyKind).toBe("immediate_danger");
  });

  it.each(MINOR)("flags under-18: %s", (input) => {
    const r = analyzeSafely(input);
    expect(r.kind === "safety" && r.safetyKind).toBe("minor");
  });

  it.each(SELF_HARM)("flags self-harm: %s", (input) => {
    const r = analyzeSafely(input);
    expect(r.kind === "safety" && r.safetyKind).toBe("self_harm");
  });

  it.each([...DANGER, ...MINOR, ...SELF_HARM])(
    "never retrieves or composes for: %s",
    (input) => {
      PIPELINE_TELEMETRY.reset();
      analyzeSafely(input);
      analyze(input);
      expect(PIPELINE_TELEMETRY.retrievalCalls).toBe(0);
      expect(PIPELINE_TELEMETRY.compositionCalls).toBe(0);
    },
  );

  it("self-harm takes precedence even with legal keywords present", () => {
    const r = analyzeSafely("my husband beats me at home and i want to kill myself");
    expect(r.kind === "safety" && r.safetyKind).toBe("self_harm");
    expect(PIPELINE_TELEMETRY.retrievalCalls).toBe(0);
    expect(PIPELINE_TELEMETRY.compositionCalls).toBe(0);
  });

  it("under-18 takes precedence over danger keywords", () => {
    const r = analyzeSafely("i am 14 and he threatened me with a knife");
    expect(r.kind === "safety" && r.safetyKind).toBe("minor");
    expect(PIPELINE_TELEMETRY.compositionCalls).toBe(0);
  });

  it("returns null for ordinary adult descriptions", () => {
    expect(safetyPreCheck("my manager at the office keeps harassing me")).toBeNull();
  });

  it("safety results never carry legal composition fields", () => {
    for (const input of [...DANGER, ...MINOR, ...SELF_HARM]) {
      const r = analyzeSafely(input);
      expect(r).not.toHaveProperty("lawMayRecognize");
      expect(r).not.toHaveProperty("source");
    }
  });
});

describe("normal flow and fallbacks", () => {
  it.each(DEMO_SCENARIOS)("composes an action card for $label", (scenario) => {
    const r = analyzeSafely(scenario.input);
    expect(r.kind).toBe("action");
    expect(r.kind === "action" && r.situation).toBe(scenario.id);
    expect(PIPELINE_TELEMETRY.compositionCalls).toBe(1);
  });

  it("falls back to the offline action card when forced", () => {
    const r = analyzeSafely(DEMO_SCENARIOS[0]!.input, { forceOffline: true });
    expect(r.kind === "action" && r.offline).toBe(true);
    expect(r.kind === "action" && r.nextSteps.length).toBeGreaterThan(0);
    expect(PIPELINE_TELEMETRY.compositionCalls).toBe(0);
  });

  it("returns out of scope for unrelated text", () => {
    const r = analyzeSafely("what is the price of tomatoes today");
    expect(r.kind === "safety" && r.safetyKind).toBe("out_of_scope");
  });

  it("never throws for arbitrary input", () => {
    for (const input of ["", "   ", "!!!", "🌧️", "a".repeat(5000)]) {
      expect(() => analyzeSafely(input)).not.toThrow();
    }
  });
});
