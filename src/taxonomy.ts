import type OpenFoodFacts from "@openfoodfacts/openfoodfacts-nodejs";

interface LocalizedString {
  [lang: string]: string;
}

interface CategoryNode {
  name: LocalizedString;
}

type CategoryTaxonomy = Record<string, CategoryNode>;

let cachedTaxonomy: CategoryTaxonomy | null = null;

export async function getCategoryTaxonomy(
  client: OpenFoodFacts
): Promise<CategoryTaxonomy> {
  if (!cachedTaxonomy) {
    try {
      cachedTaxonomy =
        (await client.getCategories()) as unknown as CategoryTaxonomy;
    } catch {
      console.error("Warning: could not load category taxonomy. Categories will be omitted.");
      cachedTaxonomy = {};
    }
  }
  return cachedTaxonomy;
}

export function translateCategoryTag(
  taxonomy: CategoryTaxonomy,
  tag: string,
  lang: string
): string | null {
  const node = taxonomy[tag];
  if (!node?.name) return null;
  return node.name[lang] ?? node.name["en"] ?? null;
}

export function translateCategoryTags(
  taxonomy: CategoryTaxonomy,
  tags: string[],
  lang: string
): string {
  return tags
    .map((tag) => translateCategoryTag(taxonomy, tag, lang))
    .filter((name): name is string => name !== null)
    .join(", ");
}

/** Reset cached taxonomy (for testing) */
export function resetTaxonomyCache(): void {
  cachedTaxonomy = null;
}
