import type { Command } from "commander";
import { getClient } from "../client.js";
import { formatProductTable } from "../formatting/table.js";

export function registerGetCommand(program: Command): void {
  program
    .command("get <ean>")
    .description("Get a product by EAN barcode")
    .action(async (ean: string) => {
      await handleGet(ean);
    });
}

async function handleGet(ean: string): Promise<void> {
  const client = getClient();

  const { data, error } = await client.getProductV2(ean);

  if (error || !data) {
    console.error("Lookup failed:", error ?? "No data returned");
    process.exit(1);
  }

  const result = data as { status: number; product?: Record<string, unknown> };

  if (!result.product || result.status === 0) {
    console.log("Product not found.");
    return;
  }

  formatProductTable([result.product]);
}
