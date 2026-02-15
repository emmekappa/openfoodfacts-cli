import { describe, test, expect } from "bun:test";
import { validateLang, SUPPORTED_LANGUAGES } from "./lang.js";

describe("validateLang", () => {
  test("accepts valid 2-letter codes", () => {
    expect(validateLang("en")).toBe("en");
    expect(validateLang("it")).toBe("it");
    expect(validateLang("fr")).toBe("fr");
    expect(validateLang("de")).toBe("de");
  });

  test("normalizes to lowercase", () => {
    expect(validateLang("EN")).toBe("en");
    expect(validateLang("It")).toBe("it");
    expect(validateLang("FR")).toBe("fr");
  });

  test("throws for 3-letter codes with suggestion", () => {
    expect(() => validateLang("ita")).toThrow("--lang it");
    expect(() => validateLang("eng")).toThrow("--lang en");
    expect(() => validateLang("fra")).toThrow("--lang fr");
    expect(() => validateLang("deu")).toThrow("--lang de");
    expect(() => validateLang("spa")).toThrow("--lang es");
  });

  test("throws for unknown codes", () => {
    expect(() => validateLang("xyz")).toThrow("not a supported language code");
    expect(() => validateLang("foo")).toThrow("not a supported language code");
  });

  test("throws for empty string", () => {
    expect(() => validateLang("")).toThrow("not a supported language code");
  });
});

describe("SUPPORTED_LANGUAGES", () => {
  test("contains common languages", () => {
    expect(SUPPORTED_LANGUAGES.has("en")).toBe(true);
    expect(SUPPORTED_LANGUAGES.has("it")).toBe(true);
    expect(SUPPORTED_LANGUAGES.has("fr")).toBe(true);
    expect(SUPPORTED_LANGUAGES.has("de")).toBe(true);
    expect(SUPPORTED_LANGUAGES.has("es")).toBe(true);
    expect(SUPPORTED_LANGUAGES.has("zh")).toBe(true);
    expect(SUPPORTED_LANGUAGES.has("ja")).toBe(true);
  });

  test("does not contain 3-letter codes", () => {
    expect(SUPPORTED_LANGUAGES.has("eng")).toBe(false);
    expect(SUPPORTED_LANGUAGES.has("ita")).toBe(false);
  });
});
