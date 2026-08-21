import { describe, expect, it } from "vitest";
import { parseCanonCheck, parseLoreDraft, safeJsonParse } from "../src/shared/validation";

describe("LoreLoop validation", () => {
  it("parses a bounded lore draft", () => {
    const draft = parseLoreDraft({
      title: "The Copper Orchard",
      entityType: "LOCATION",
      summary: "A cultivated valley where metallic trees remember rainfall.",
      content: "The orchard sits beyond the old road and gathers weather in its branches. Its keeper measures the fruit by sound, not color, because each hollow sphere carries an echo of the season that formed it. Travelers come for shade, but leave with a map of storms that have not happened yet. The valley has become a quiet meeting place for people who disagree about whether memory belongs to the land or to those who listen.",
      importance: 62,
      connections: [],
      introducedMysteries: ["Who planted the first metal tree?"] ,
      resolvedMysteries: [],
      canonFacts: ["The orchard records weather in its fruit."],
      worldImpact: "The orchard gives the region a shared place to study weather and memory.",
    });
    expect(draft.entityType).toBe("LOCATION");
    expect(draft.importance).toBe(62);
  });

  it("rejects unsupported entity types", () => {
    expect(() => parseLoreDraft({ title: "Bad", entityType: "UNSUPPORTED" })).toThrow();
  });

  it("extracts JSON from a model code fence", () => {
    expect(safeJsonParse("```json\n{\"valid\":true}\n```")).toEqual({ valid: true });
  });

  it("parses canon severity", () => {
    expect(parseCanonCheck({ valid: false, conflicts: ["Era mismatch"], severity: "MINOR" }).severity).toBe("MINOR");
  });
});

