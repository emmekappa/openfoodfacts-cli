import { describe, test, expect } from "bun:test";
import OpenFoodFacts from "@openfoodfacts/openfoodfacts-nodejs";

function getClient(): OpenFoodFacts {
  return new OpenFoodFacts(globalThis.fetch);
}

describe("get endpoint (integration)", () => {
  test("returns product data for a known barcode", async () => {
    const client = getClient();
    const { data, error } = await client.getProductV2("3017620422003"); // Nutella

    expect(error).toBeUndefined();
    expect(data).toBeDefined();

    const result = data as { status: number; product?: Record<string, unknown> };

    expect(result.status).toBe(1);
    expect(result.product).toBeDefined();
    expect(result.product!.code).toBe("3017620422003");
    expect(result.product!.product_name).toBeDefined();
  });

  test("product contains nutriments with expected fields", async () => {
    const client = getClient();
    const { data } = await client.getProductV2("3017620422003"); // Nutella

    const result = data as { product?: Record<string, unknown> };
    expect(result.product).toBeDefined();

    const nutriments = result.product!.nutriments as Record<string, unknown>;
    expect(nutriments).toBeDefined();

    const expectedKeys = [
      "energy-kcal_100g",
      "fat_100g",
      "carbohydrates_100g",
      "proteins_100g",
      "salt_100g",
    ];

    for (const key of expectedKeys) {
      expect(nutriments[key]).toBeNumber();
    }
  });

  test("product contains brands and nutrition_grades", async () => {
    const client = getClient();
    const { data } = await client.getProductV2("3017620422003"); // Nutella

    const result = data as { product?: Record<string, unknown> };
    expect(result.product).toBeDefined();
    expect(result.product!.brands).toBeDefined();
    expect(result.product!.nutrition_grades).toBeDefined();
  });

  test("returns status 0 for a non-existent barcode", async () => {
    const client = getClient();
    const { data, error } = await client.getProductV2("0000000000000");

    expect(error).toBeUndefined();
    expect(data).toBeDefined();

    const result = data as { status: number; product?: Record<string, unknown> };

    expect(result.status).toBe(0);
  });
});
