import { InvalidArgumentError } from "commander";

/**
 * ISO 639-1 language codes commonly available in the Open Food Facts taxonomy.
 * Open Food Facts uses 2-letter codes (e.g. "en", "it", "fr"), not 3-letter
 * codes like "eng" or "ita".
 */
export const SUPPORTED_LANGUAGES = new Set([
  "ar", "bg", "bn", "ca", "cs", "da", "de", "el", "en", "es", "et",
  "fa", "fi", "fr", "he", "hi", "hr", "hu", "id", "it", "ja", "ka",
  "kk", "ko", "lt", "lv", "mk", "ms", "nb", "nl", "nn", "pl", "pt",
  "ro", "ru", "sk", "sl", "sq", "sr", "sv", "th", "tr", "uk", "vi",
  "zh",
]);

/** Common 3-letter to 2-letter code mappings for helpful error messages */
const THREE_TO_TWO: Record<string, string> = {
  eng: "en", ita: "it", fra: "fr", deu: "de", spa: "es",
  por: "pt", nld: "nl", pol: "pl", rus: "ru", jpn: "ja",
  zho: "zh", kor: "ko", ara: "ar", tur: "tr", swe: "sv",
};

export function validateLang(value: string): string {
  const lower = value.toLowerCase();

  if (SUPPORTED_LANGUAGES.has(lower)) {
    return lower;
  }

  const suggestion = THREE_TO_TWO[lower];
  if (suggestion) {
    throw new InvalidArgumentError(
      `"${value}" is a 3-letter code. Use the 2-letter code instead: --lang ${suggestion}`
    );
  }

  throw new InvalidArgumentError(
    `"${value}" is not a supported language code. ` +
    `Use a 2-letter ISO 639-1 code (e.g. en, it, fr, de, es). ` +
    `Run "off languages" to see all supported codes.`
  );
}
