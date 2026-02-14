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
  nutrition_grades?: string;
  nutriments?: Nutriments;
}

export function formatProductTable(hits: Record<string, unknown>[]): void {
  const products = hits as unknown as Product[];
  const headers = ["Barcode", "Name", "Brand", "Nutriscore", "kcal", "Fat", "Carbs", "Prot", "Salt"];

  const rows = products.map((p) => [
    p.code ?? "-",
    truncate(p.product_name ?? "-", 40),
    truncate(formatBrands(p.brands), 25),
    formatNutriscore(p.nutrition_grades),
    formatNutrient(p.nutriments?.["energy-kcal_100g"]),
    formatNutrient(p.nutriments?.["fat_100g"]),
    formatNutrient(p.nutriments?.["carbohydrates_100g"]),
    formatNutrient(p.nutriments?.["proteins_100g"]),
    formatNutrient(p.nutriments?.["salt_100g"]),
  ]);

  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => r[i].length))
  );

  console.log(headers.map((h, i) => h.padEnd(widths[i])).join("  "));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));

  for (const row of rows) {
    console.log(row.map((cell, i) => cell.padEnd(widths[i])).join("  "));
  }
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "\u2026";
}

function formatBrands(brands: string[] | string | undefined): string {
  if (!brands) return "-";
  if (Array.isArray(brands)) return brands.join(", ");
  return brands;
}

function formatNutriscore(grade: string | undefined): string {
  if (!grade || grade === "unknown" || grade === "not-applicable") return "-";
  return grade.toUpperCase();
}

function formatNutrient(value: number | undefined): string {
  if (value === undefined || value === null) return "-";
  return value % 1 === 0 ? String(value) : value.toFixed(1);
}
