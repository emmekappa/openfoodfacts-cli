// Must run before any picocolors import to disable colors early
if (process.argv.includes("--no-color")) {
  process.env.NO_COLOR = "1";
}

import { program } from "commander";
import { registerSearchCommand } from "./commands/search.js";
import { registerGetCommand } from "./commands/get.js";
import { validateLang, SUPPORTED_LANGUAGES } from "./lang.js";

program
  .name("off")
  .description("CLI for the OpenFoodFacts API")
  .version("0.1.0")
  .option("--lang <code>", "2-letter language code for categories (e.g. en, it, fr)", validateLang, "en")
  .option("--no-color", "disable colored output");

program
  .command("languages")
  .description("List all supported language codes")
  .action(() => {
    console.log("Supported language codes:");
    console.log([...SUPPORTED_LANGUAGES].sort().join(", "));
  });

registerSearchCommand(program);
registerGetCommand(program);

program.parse();
