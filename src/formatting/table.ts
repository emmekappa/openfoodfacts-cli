import {
  colorBarcode,
  colorBrand,
  colorCategories,
  colorHeader,
  colorName,
  colorNutriscore,
  colorNutrient,
  padEndVisible,
  stripAnsi,
} from "./colors.js";
import { formatBrands, type Product } from "./product.js";

export interface TableOptions {
  truncate?: boolean;
}

export function formatProductTable(
  hits: Record<string, unknown>[],
  options: TableOptions = {}
): void {
  const { truncate: shouldTruncate = true } = options;
  const products = hits as unknown as Product[];
  const headers = ["Barcode", "Name", "Brand", "Categories", "Nutriscore", "kcal", "Fat", "Carbs", "Prot", "Salt"];

  const t = (str: string, maxLen: number): string =>
    shouldTruncate ? truncate(str, maxLen) : str;

  const rows = products.map((p) => [
    colorBarcode(p.code ?? "-"),
    colorName(t(p.product_name ?? "-", 40)),
    colorBrand(t(formatBrands(p.brands), 25)),
    colorCategories(t(p.categories ?? "-", 30)),
    colorNutriscore(p.nutrition_grades),
    colorNutrient(p.nutriments?.["energy-kcal_100g"], "energy-kcal_100g"),
    colorNutrient(p.nutriments?.["fat_100g"], "fat_100g"),
    colorNutrient(p.nutriments?.["carbohydrates_100g"], "carbohydrates_100g"),
    colorNutrient(p.nutriments?.["proteins_100g"], "proteins_100g"),
    colorNutrient(p.nutriments?.["salt_100g"], "salt_100g"),
  ]);

  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => stripAnsi(r[i]).length))
  );

  console.log(headers.map((h, i) => colorHeader(h.padEnd(widths[i]))).join("  "));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));

  for (const row of rows) {
    console.log(row.map((cell, i) => padEndVisible(cell, widths[i])).join("  "));
  }
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "\u2026";
}


