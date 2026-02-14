# openfoodfacts-cli

A command-line interface for the [OpenFoodFacts API](https://world.openfoodfacts.org/).

## Prerequisites

- [Bun](https://bun.sh/) runtime

## Setup

```bash
bun install
```

## Usage

### Search for products

```bash
bun run src/cli.ts search <query>
```

Options:

| Flag | Description | Default |
|------|-------------|---------|
| `--page <number>` | Page number (starts at 1) | 1 |
| `--page-size <number>` | Results per page | 10 |
| `--sort-by <field>` | Sort by field (prefix with `-` for descending) | — |

Examples:

```bash
bun run src/cli.ts search nutella
bun run src/cli.ts search "organic chocolate" --page-size 5
bun run src/cli.ts search pasta --page 2
```

### Get a product by barcode

```bash
bun run src/cli.ts get <ean>
```

Example:

```bash
bun run src/cli.ts get 3017620422003
```

## Dependencies

- [openfoodfacts-nodejs](https://github.com/openfoodfacts/openfoodfacts-js) — Official JavaScript SDK for OpenFoodFacts
- [Commander.js](https://github.com/tj/commander.js) — CLI framework
