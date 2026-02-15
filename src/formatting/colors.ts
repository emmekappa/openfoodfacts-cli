import pc from "picocolors";

const NUTRISCORE_CONFIG: Record<string, { color: (s: string) => string; emoji: string }> = {
  a: { color: pc.green, emoji: "🟢" },
  b: { color: (s: string) => pc.green(s), emoji: "🟢" },
  c: { color: pc.yellow, emoji: "🟡" },
  d: { color: (s: string) => pc.yellow(s), emoji: "🟠" },
  e: { color: pc.red, emoji: "🔴" },
};

export function colorNutriscore(grade: string | undefined): string {
  if (!grade || grade === "unknown" || grade === "not-applicable") return pc.dim("-");
  const key = grade.toLowerCase();
  const config = NUTRISCORE_CONFIG[key];
  if (!config) return grade.toUpperCase();
  if (pc.isColorSupported) {
    return `${config.emoji} ${config.color(pc.bold(key.toUpperCase()))}`;
  }
  return key.toUpperCase();
}

/**
 * Returns the display length of a nutriscore string (for column alignment).
 * Emoji counts as 2 chars width in most terminals, plus space + letter = 4.
 */
export function nutriscoreDisplayWidth(grade: string | undefined): number {
  if (!grade || grade === "unknown" || grade === "not-applicable") return 1;
  const key = grade.toLowerCase();
  if (NUTRISCORE_CONFIG[key]) {
    return pc.isColorSupported ? 4 : 1; // emoji(2) + space(1) + letter(1) vs just letter
  }
  return grade.length;
}

export function colorBarcode(code: string): string {
  return pc.dim(code);
}

export function colorName(name: string): string {
  return pc.bold(name);
}

export function colorBrand(brand: string): string {
  return pc.cyan(brand);
}

export function colorCategories(categories: string): string {
  return pc.magenta(categories);
}

export function colorLabel(label: string): string {
  return pc.bold(pc.dim(label));
}

export function colorHeader(header: string): string {
  return pc.bold(pc.underline(header));
}

/** Nutrient thresholds per 100g (high = warning, very high = danger) */
const NUTRIENT_THRESHOLDS: Record<string, { high: number; veryHigh: number }> = {
  "energy-kcal_100g": { high: 400, veryHigh: 600 },
  "fat_100g": { high: 17.5, veryHigh: 25 },
  "carbohydrates_100g": { high: 40, veryHigh: 60 },
  "proteins_100g": { high: Infinity, veryHigh: Infinity }, // no warning
  "salt_100g": { high: 1.5, veryHigh: 2.4 },
};

export function colorNutrient(
  value: number | undefined,
  key?: string
): string {
  if (value === undefined || value === null) return pc.dim("-");
  const formatted = value % 1 === 0 ? String(value) : value.toFixed(1);
  if (!key) return formatted;

  const threshold = NUTRIENT_THRESHOLDS[key];
  if (!threshold) return formatted;

  if (value >= threshold.veryHigh) return pc.red(pc.bold(formatted));
  if (value >= threshold.high) return pc.yellow(formatted);
  return pc.green(formatted);
}

/**
 * Strip ANSI escape codes to get the visible character length.
 */
export function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

/**
 * Pad a string containing ANSI codes to a target visible width.
 */
export function padEndVisible(str: string, width: number): string {
  const visible = stripAnsi(str).length;
  if (visible >= width) return str;
  return str + " ".repeat(width - visible);
}
