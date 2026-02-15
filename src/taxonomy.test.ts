import { describe, test, expect } from "bun:test";
import { translateCategoryTag, translateCategoryTags } from "./taxonomy.js";

const taxonomy = {
  "en:pastas": {
    name: { en: "Pastas", it: "Paste", fr: "Pâtes" },
  },
  "en:spreads": {
    name: { en: "Spreads", fr: "Pâtes à tartiner" },
  },
  "en:chocolate-spreads": {
    name: { en: "Chocolate spreads", it: "Creme spalmabili al cioccolato" },
  },
};

describe("translateCategoryTag", () => {
  test("returns name in requested language", () => {
    expect(translateCategoryTag(taxonomy, "en:pastas", "it")).toBe("Paste");
  });

  test("falls back to English when language is missing", () => {
    expect(translateCategoryTag(taxonomy, "en:spreads", "it")).toBe("Spreads");
  });

  test("returns null when not found in taxonomy", () => {
    expect(translateCategoryTag(taxonomy, "en:unknown", "it")).toBeNull();
  });

  test("returns English name when requesting English", () => {
    expect(translateCategoryTag(taxonomy, "en:pastas", "en")).toBe("Pastas");
  });
});

describe("translateCategoryTags", () => {
  test("translates multiple tags joined by comma", () => {
    const result = translateCategoryTags(
      taxonomy,
      ["en:spreads", "en:chocolate-spreads"],
      "it"
    );
    expect(result).toBe("Spreads, Creme spalmabili al cioccolato");
  });

  test("returns empty string for empty array", () => {
    expect(translateCategoryTags(taxonomy, [], "it")).toBe("");
  });

  test("omits unknown tags from result", () => {
    const result = translateCategoryTags(
      taxonomy,
      ["en:pastas", "en:nonexistent"],
      "it"
    );
    expect(result).toBe("Paste");
  });

  test("returns empty string when all tags are unknown", () => {
    const result = translateCategoryTags(
      taxonomy,
      ["en:nonexistent", "en:also-unknown"],
      "it"
    );
    expect(result).toBe("");
  });
});
