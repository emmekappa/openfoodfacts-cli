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

  const { data, error } = await client.getProductV3(ean, { fields: ["all"] });

  if (error || !data) {
    const err = error as { result?: { name?: string } } | undefined;
    const message = err?.result?.name ?? "Product not found";
    console.error(message);
    process.exit(1);
  }

  if (data.status === "failure") {
    console.error(data.result.name);
    process.exit(1);
  }

  const product = data.product as unknown as Record<string, unknown>;

  if (!product.product_name) {
    console.log("Product not found.");
    return;
  }

  formatProductTable([product]);
}
