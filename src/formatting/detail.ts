import {
  colorBarcode,
  colorBrand,
  colorCategories,
  colorLabel,
  colorName,
  colorNutriscore,
  colorNutrient,
  stripAnsi,
} from "./colors.js";

interface Nutriments {
  "energy-kcal_100g"?: number;
  "fat_100g"?: number;
  "carbohydrates_100g"?: number;
  "proteins_100g"?: number;
  "salt_100g"?: number;
}

interface Product {
  code?: string;
  product_name?: string;
  brands?: string[] | string;
  categories?: string;
  nutrition_grades?: string;
  nutriments?: Nutriments;
}

export function formatProductDetail(hit: Record<string, unknown>): void {
  const p = hit as unknown as Product;

  const rows: [string, string][] = [
    ["Barcode", colorBarcode(p.code ?? "-")],
    ["Name", colorName(p.product_name ?? "-")],
    ["Brand", colorBrand(formatBrands(p.brands))],
    ["Categories", colorCategories(p.categories ?? "-")],
    ["Nutriscore", colorNutriscore(p.nutrition_grades)],
    ["Energy (kcal/100g)", colorNutrient(p.nutriments?.["energy-kcal_100g"], "energy-kcal_100g")],
    ["Fat (g/100g)", colorNutrient(p.nutriments?.["fat_100g"], "fat_100g")],
    ["Carbs (g/100g)", colorNutrient(p.nutriments?.["carbohydrates_100g"], "carbohydrates_100g")],
    ["Proteins (g/100g)", colorNutrient(p.nutriments?.["proteins_100g"], "proteins_100g")],
    ["Salt (g/100g)", colorNutrient(p.nutriments?.["salt_100g"], "salt_100g")],
  ];

  const labelWidth = Math.max(
    ...rows.map(([label]) => stripAnsi(label).length)
  );

  for (const [label, value] of rows) {
    console.log(`${colorLabel(label.padEnd(labelWidth))}  ${value}`);
  }
}

function formatBrands(brands: string[] | string | undefined): string {
  if (!brands) return "-";
  if (Array.isArray(brands)) return brands.join(", ");
  return brands;
}
