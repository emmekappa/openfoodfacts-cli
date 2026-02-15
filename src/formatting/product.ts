export interface Nutriments {
  "energy-kcal_100g"?: number;
  "fat_100g"?: number;
  "carbohydrates_100g"?: number;
  "proteins_100g"?: number;
  "salt_100g"?: number;
}

export interface Product {
  code?: string;
  product_name?: string;
  brands?: string[] | string;
  categories?: string;
  nutrition_grades?: string;
  nutriments?: Nutriments;
}

export function formatBrands(brands: string[] | string | undefined): string {
  if (!brands) return "-";
  if (Array.isArray(brands)) return brands.join(", ");
  return brands;
}
