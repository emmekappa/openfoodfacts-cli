import type { Command } from "commander";
import { getSearchApi } from "../client.js";
import { formatProductTable } from "../formatting/table.js";

interface SearchResult {
  hits: Record<string, unknown>[];
  page: number;
  page_size: number;
  page_count: number;
  count: number;
}

export function registerSearchCommand(program: Command): void {
  program
    .command("search <query>")
    .description("Search for food products by name or keyword")
    .option("--page <number>", "page number (starts at 1)", "1")
    .option("--page-size <number>", "results per page", "10")
    .option("--sort-by <field>", "sort by field (prefix with - for descending)")
    .action(async (query: string, options) => {
      await handleSearch(query, {
        page: parseInt(options.page, 10),
        pageSize: parseInt(options.pageSize, 10),
        sortBy: options.sortBy,
      });
    });
}

interface SearchOptions {
  page: number;
  pageSize: number;
  sortBy?: string;
}

async function handleSearch(
  query: string,
  options: SearchOptions
): Promise<void> {
  const api = getSearchApi();

  const { data, error } = await api.searchGet({
    q: query,
    page: options.page,
    page_size: options.pageSize,
    sort_by: options.sortBy,
    fields: "code,product_name,brands,nutrition_grades,nutriments",
  });

  if (error || !data) {
    console.error("Search failed:", error ?? "No data returned");
    process.exit(1);
  }

  const result = data as SearchResult;

  if (!result.hits || result.hits.length === 0) {
    console.log("No products found.");
    return;
  }

  console.log(`Found ${result.count} results (page ${result.page}/${result.page_count})`);
  console.log();

  formatProductTable(result.hits);

  if (result.page < result.page_count) {
    console.log();
    console.log(`Use --page ${result.page + 1} to see next page`);
  }
}
