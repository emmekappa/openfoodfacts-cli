import { describe, test, expect } from "bun:test";
import OpenFoodFacts from "@openfoodfacts/openfoodfacts-nodejs";

function getClient(): OpenFoodFacts {
  return new OpenFoodFacts(globalThis.fetch);
}

describe("get endpoint (integration)", () => {
  test("returns product data for a known barcode", async () => {
    const client = getClient();
    const { data, error } = await client.getProductV3("3017620422003", { fields: ["all"] }); // Nutella

    expect(error).toBeUndefined();
    expect(data).toBeDefined();
    expect(data!.status).toMatch(/^success/);
    expect("product" in data!).toBe(true);

    const product = (data as { product: Record<string, unknown> }).product;
    expect(product.code).toBe("3017620422003");
    expect(product.product_name).toBeDefined();
  });

  test("product contains nutriments with expected fields", async () => {
    const client = getClient();
    const { data } = await client.getProductV3("3017620422003", { fields: ["all"] }); // Nutella

    expect(data).toBeDefined();
    const product = (data as { product: Record<string, unknown> }).product;
    expect(product).toBeDefined();

    const nutriments = product.nutriments as Record<string, unknown>;
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
    const { data } = await client.getProductV3("3017620422003", { fields: ["all"] }); // Nutella

    expect(data).toBeDefined();
    const product = (data as { product: Record<string, unknown> }).product;
    expect(product).toBeDefined();
    expect(product.brands).toBeDefined();
    expect(product.nutrition_grades).toBeDefined();
  });

  test("returns failure for a non-existent barcode", async () => {
    const client = getClient();
    const { data, error } = await client.getProductV3("9999999999991", { fields: ["all"] });

    // The API may return an error or a failure status for unknown barcodes
    if (error) {
      expect(error).toBeDefined();
    } else {
      expect(data).toBeDefined();
      const result = data as { status?: string; product?: Record<string, unknown> };
      const isFailure = result.status === "failure";
      const hasNoName = !result.product?.product_name;
      expect(isFailure || hasNoName).toBe(true);
    }
  });
});
