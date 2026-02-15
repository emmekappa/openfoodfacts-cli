import { describe, test, expect, spyOn, beforeEach } from "bun:test";
import { formatProductDetail } from "./detail.js";

describe("formatProductDetail", () => {
  let output: string[];

  beforeEach(() => {
    output = [];
    spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      output.push(args.map(String).join(" "));
    });
  });

  test("renders all fields as label-value rows", () => {
    const product = {
      code: "3017620422003",
      product_name: "Nutella",
      brands: "Ferrero",
      categories: "Spreads, Chocolate spreads, Hazelnut spreads",
      nutrition_grades: "e",
      nutriments: {
        "energy-kcal_100g": 539,
        "fat_100g": 30.9,
        "carbohydrates_100g": 57.5,
        "proteins_100g": 6.3,
        "salt_100g": 0.1,
      },
    };

    formatProductDetail(product as Record<string, unknown>);

    expect(output).toHaveLength(10);
    expect(output[0]).toContain("Barcode");
    expect(output[0]).toContain("3017620422003");
    expect(output[1]).toContain("Name");
    expect(output[1]).toContain("Nutella");
    expect(output[2]).toContain("Brand");
    expect(output[2]).toContain("Ferrero");
    expect(output[3]).toContain("Categories");
    expect(output[3]).toContain("Spreads, Chocolate spreads, Hazelnut spreads");
    expect(output[4]).toContain("Nutriscore");
    expect(output[4]).toContain("E");
  });

  test("does not truncate long categories", () => {
    const longCategories =
      "Plant-based foods and beverages, Plant-based foods, " +
      "Cereals and potatoes, Cereals and their products, Breads";

    const product = {
      code: "123",
      product_name: "Test",
      categories: longCategories,
    };

    formatProductDetail(product as Record<string, unknown>);

    const categoriesRow = output[3];
    expect(categoriesRow).toContain(longCategories);
  });

  test("renders dash for missing fields", () => {
    formatProductDetail({} as Record<string, unknown>);

    expect(output).toHaveLength(10);
    for (const line of output) {
      expect(line).toContain("-");
    }
  });

  test("formats brands array as comma-separated string", () => {
    const product = {
      code: "123",
      brands: ["Brand A", "Brand B"],
    };

    formatProductDetail(product as Record<string, unknown>);

    const brandRow = output[2];
    expect(brandRow).toContain("Brand A, Brand B");
  });
});
