import { describe, test, expect } from "bun:test";
import pc from "picocolors";
import {
  colorNutriscore,
  colorNutrient,
  stripAnsi,
  padEndVisible,
} from "./colors.js";

describe("colorNutriscore", () => {
  test("returns uppercase letter for grade A", () => {
    const result = colorNutriscore("a");
    const visible = stripAnsi(result);
    expect(visible).toContain("A");
  });

  test("includes emoji when color is supported", () => {
    if (pc.isColorSupported) {
      expect(colorNutriscore("a")).toContain("🟢");
      expect(colorNutriscore("e")).toContain("🔴");
    }
  });

  test("returns just uppercase letter when color is not supported", () => {
    if (!pc.isColorSupported) {
      expect(colorNutriscore("a")).toBe("A");
      expect(colorNutriscore("e")).toBe("E");
    }
  });

  test("returns uppercase letter for grade E", () => {
    const result = colorNutriscore("e");
    const visible = stripAnsi(result);
    expect(visible).toContain("E");
  });

  test("returns dash for unknown grade", () => {
    const result = colorNutriscore("unknown");
    const visible = stripAnsi(result);
    expect(visible).toBe("-");
  });

  test("returns dash for undefined grade", () => {
    const result = colorNutriscore(undefined);
    const visible = stripAnsi(result);
    expect(visible).toBe("-");
  });
});

describe("colorNutrient", () => {
  test("returns formatted value for low fat", () => {
    const result = colorNutrient(5, "fat_100g");
    const visible = stripAnsi(result);
    expect(visible).toBe("5");
  });

  test("returns formatted value for high fat", () => {
    const result = colorNutrient(20, "fat_100g");
    const visible = stripAnsi(result);
    expect(visible).toBe("20");
  });

  test("returns formatted value for very high fat", () => {
    const result = colorNutrient(30, "fat_100g");
    const visible = stripAnsi(result);
    expect(visible).toBe("30");
  });

  test("returns dash for undefined value", () => {
    const result = colorNutrient(undefined);
    const visible = stripAnsi(result);
    expect(visible).toBe("-");
  });

  test("formats decimal values with one decimal place", () => {
    const result = colorNutrient(1.23, "salt_100g");
    const visible = stripAnsi(result);
    expect(visible).toBe("1.2");
  });
});

describe("stripAnsi", () => {
  test("removes ANSI codes from string", () => {
    expect(stripAnsi("\x1b[31mhello\x1b[0m")).toBe("hello");
  });

  test("returns plain string unchanged", () => {
    expect(stripAnsi("hello")).toBe("hello");
  });
});

describe("padEndVisible", () => {
  test("pads based on visible width ignoring ANSI codes", () => {
    const colored = "\x1b[31mhi\x1b[0m";
    const padded = padEndVisible(colored, 5);
    expect(stripAnsi(padded)).toBe("hi   ");
  });

  test("does not pad if already at target width", () => {
    const result = padEndVisible("hello", 5);
    expect(result).toBe("hello");
  });
});
