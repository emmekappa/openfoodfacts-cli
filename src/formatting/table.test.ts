import { describe, test, expect, spyOn, beforeEach } from "bun:test";
import { formatProductTable } from "./table.js";
import { stripAnsi } from "./colors.js";

describe("formatProductTable", () => {
  let output: string[];

  beforeEach(() => {
    output = [];
    spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      output.push(args.map(String).join(" "));
    });
  });

  function plainRow(index: number): string {
    return stripAnsi(output[index]);
  }

  test("renders header with categories and nutrition columns", () => {
    formatProductTable([]);

    const header = plainRow(0);
    expect(header).toContain("Categories");
    expect(header).toContain("kcal");
    expect(header).toContain("Fat");
    expect(header).toContain("Carbs");
    expect(header).toContain("Prot");
    expect(header).toContain("Salt");
  });

  test("renders categories and nutriment values for a product", () => {
    const hits = [
      {
        code: "123",
        product_name: "Test Product",
        brands: "TestBrand",
        categories: "Spreads, Chocolate spreads",
        nutrition_grades: "a",
        nutriments: {
          "energy-kcal_100g": 540,
          "fat_100g": 30.9,
          "carbohydrates_100g": 57.5,
          "proteins_100g": 6.3,
          "salt_100g": 0.1,
        },
      },
    ];

    formatProductTable(hits as Record<string, unknown>[]);

    const dataRow = plainRow(2);
    expect(dataRow).toContain("Spreads, Chocolate spreads");
    expect(dataRow).toContain("540");
    expect(dataRow).toContain("30.9");
    expect(dataRow).toContain("57.5");
    expect(dataRow).toContain("6.3");
    expect(dataRow).toContain("0.1");
  });

  test("renders nutriscore letter for grade A", () => {
    const hits = [
      {
        code: "100",
        product_name: "Healthy",
        nutrition_grades: "a",
      },
    ];

    formatProductTable(hits as Record<string, unknown>[]);

    expect(plainRow(2)).toContain("A");
  });

  test("renders nutriscore letter for grade E", () => {
    const hits = [
      {
        code: "101",
        product_name: "Unhealthy",
        nutrition_grades: "e",
      },
    ];

    formatProductTable(hits as Record<string, unknown>[]);

    expect(plainRow(2)).toContain("E");
  });

  test("renders dash for missing categories and nutriments", () => {
    const hits = [
      {
        code: "456",
        product_name: "No Nutrition",
        brands: "Brand",
        nutrition_grades: "unknown",
      },
    ];

    formatProductTable(hits as Record<string, unknown>[]);

    const dataRow = plainRow(2);
    // Categories + Nutriscore + 5 nutrition columns = 7 dashes
    const dashes = dataRow.match(/(^|\s)-(\s|$)/g);
    expect(dashes).not.toBeNull();
    expect(dashes!.length).toBeGreaterThanOrEqual(6);
  });

  test("formats integer values without decimals", () => {
    const hits = [
      {
        code: "789",
        product_name: "Round Values",
        brands: "B",
        nutriments: {
          "energy-kcal_100g": 100,
          "fat_100g": 5,
          "carbohydrates_100g": 20,
          "proteins_100g": 10,
          "salt_100g": 1,
        },
      },
    ];

    formatProductTable(hits as Record<string, unknown>[]);

    const dataRow = plainRow(2);
    expect(dataRow).toContain("100");
    expect(dataRow).not.toContain("100.0");
    expect(dataRow).not.toContain("5.0");
  });

  test("truncates long categories", () => {
    const hits = [
      {
        code: "999",
        product_name: "Long Cat Product",
        brands: "B",
        categories: "Spreads, Chocolate spreads, Hazelnut spreads",
      },
    ];

    formatProductTable(hits as Record<string, unknown>[]);

    const dataRow = plainRow(2);
    expect(dataRow).not.toContain("Hazelnut spreads");
    expect(dataRow).toContain("\u2026");
  });

  test("does not truncate when truncate option is false", () => {
    const longName = "A".repeat(60);
    const longCategories = "Spreads, Chocolate spreads, Hazelnut spreads and more";
    const hits = [
      {
        code: "888",
        product_name: longName,
        brands: "B",
        categories: longCategories,
      },
    ];

    formatProductTable(hits as Record<string, unknown>[], { truncate: false });

    const dataRow = plainRow(2);
    expect(dataRow).toContain(longName);
    expect(dataRow).toContain(longCategories);
  });

  test("formats decimal values with one decimal place", () => {
    const hits = [
      {
        code: "012",
        product_name: "Decimal Values",
        brands: "B",
        nutriments: {
          "energy-kcal_100g": 123.456,
          "fat_100g": 1.23,
        },
      },
    ];

    formatProductTable(hits as Record<string, unknown>[]);

    const dataRow = plainRow(2);
    expect(dataRow).toContain("123.5");
    expect(dataRow).toContain("1.2");
  });
});
