import { describe, test, expect, spyOn, beforeEach } from "bun:test";
import { formatProductTable } from "./table.js";

describe("formatProductTable", () => {
  let output: string[];

  beforeEach(() => {
    output = [];
    spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      output.push(args.map(String).join(" "));
    });
  });

  test("renders header with nutrition columns", () => {
    formatProductTable([]);

    const header = output[0];
    expect(header).toContain("kcal");
    expect(header).toContain("Fat");
    expect(header).toContain("Carbs");
    expect(header).toContain("Prot");
    expect(header).toContain("Salt");
  });

  test("renders nutriment values for a product", () => {
    const hits = [
      {
        code: "123",
        product_name: "Test Product",
        brands: "TestBrand",
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

    const dataRow = output[2]; // header, separator, first row
    expect(dataRow).toContain("540");
    expect(dataRow).toContain("30.9");
    expect(dataRow).toContain("57.5");
    expect(dataRow).toContain("6.3");
    expect(dataRow).toContain("0.1");
  });

  test("renders dash for missing nutriments", () => {
    const hits = [
      {
        code: "456",
        product_name: "No Nutrition",
        brands: "Brand",
        nutrition_grades: "unknown",
      },
    ];

    formatProductTable(hits as Record<string, unknown>[]);

    const dataRow = output[2];
    // 5 nutrition columns should all be "-"
    const cells = dataRow.split(/\s{2,}/).filter((c) => c.length > 0);
    // Last 5 cells: kcal, Fat, Carbs, Prot, Salt
    const nutritionCells = cells.slice(-5);
    expect(nutritionCells).toHaveLength(5);
    for (const cell of nutritionCells) {
      expect(cell.trim()).toBe("-");
    }
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

    const dataRow = output[2];
    expect(dataRow).toContain("100");
    // Should not contain "100.0" or "5.0"
    expect(dataRow).not.toContain("100.0");
    expect(dataRow).not.toContain("5.0");
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

    const dataRow = output[2];
    expect(dataRow).toContain("123.5");
    expect(dataRow).toContain("1.2");
  });
});
