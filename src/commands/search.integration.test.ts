import { describe, test, expect } from "bun:test";
import { SearchApi } from "@openfoodfacts/openfoodfacts-nodejs";

const SEARCH_FIELDS = "code,product_name,brands,nutrition_grades,nutriments";

function getApi(): SearchApi {
  return new SearchApi(globalThis.fetch);
}

describe("search endpoint (integration)", () => {
  test("returns products with nutriments for a common query", async () => {
    const api = getApi();
    const { data, error } = await api.searchGet({
      q: "nutella",
      page: 1,
      page_size: 5,
      fields: SEARCH_FIELDS,
    });

    expect(error).toBeUndefined();
    expect(data).toBeDefined();

    const result = data as {
      hits: Record<string, unknown>[];
      count: number;
    };

    expect(result.hits.length).toBeGreaterThan(0);

    const product = result.hits[0] as {
      code?: string;
      product_name?: string;
      nutriments?: Record<string, unknown>;
    };

    expect(product.code).toBeDefined();
    expect(product.product_name).toBeDefined();
    expect(product.nutriments).toBeDefined();
    expect(product.nutriments!["energy-kcal_100g"]).toBeNumber();
  });

  test("nutriments contain all expected fields", async () => {
    const api = getApi();
    const { data } = await api.searchGet({
      q: "barilla pasta",
      page: 1,
      page_size: 3,
      fields: SEARCH_FIELDS,
    });

    const result = data as { hits: Record<string, unknown>[] };
    const withNutriments = result.hits.find(
      (h) => h.nutriments && typeof h.nutriments === "object"
    );

    expect(withNutriments).toBeDefined();

    const nutriments = withNutriments!.nutriments as Record<string, unknown>;
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

  test("handles products with missing nutriments gracefully", async () => {
    const api = getApi();
    const { data } = await api.searchGet({
      q: "test",
      page: 1,
      page_size: 20,
      fields: SEARCH_FIELDS,
    });

    const result = data as { hits: Record<string, unknown>[] };
    expect(result.hits.length).toBeGreaterThan(0);

    // Every hit should have at least code — nutriments may be missing on some
    for (const hit of result.hits) {
      expect(hit.code).toBeDefined();
    }
  });

  test("pagination works correctly", async () => {
    const api = getApi();

    const page1 = await api.searchGet({
      q: "pizza",
      page: 1,
      page_size: 3,
      fields: SEARCH_FIELDS,
    });

    const page2 = await api.searchGet({
      q: "pizza",
      page: 2,
      page_size: 3,
      fields: SEARCH_FIELDS,
    });

    const hits1 = (page1.data as { hits: Record<string, unknown>[] }).hits;
    const hits2 = (page2.data as { hits: Record<string, unknown>[] }).hits;

    expect(hits1.length).toBe(3);
    expect(hits2.length).toBe(3);

    const codes1 = hits1.map((h) => h.code);
    const codes2 = hits2.map((h) => h.code);

    // Pages should return different products
    const overlap = codes1.filter((c) => codes2.includes(c));
    expect(overlap.length).toBe(0);
  });
});
