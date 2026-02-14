import { program } from "commander";
import { registerSearchCommand } from "./commands/search.js";
import { registerGetCommand } from "./commands/get.js";

program
  .name("off")
  .description("CLI for the OpenFoodFacts API")
  .version("0.1.0");

registerSearchCommand(program);
registerGetCommand(program);

program.parse();
