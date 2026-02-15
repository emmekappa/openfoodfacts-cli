# openfoodfacts-cli

Command-line interface for the [OpenFoodFacts API](https://world.openfoodfacts.org/), ready for AI agents.

## Installation

```bash
npm install -g openfoodfacts-cli
```

## Usage

### Search for products

```bash
off search <query>
```

Options:

| Flag | Description | Default |
|------|-------------|---------|
| `--page <number>` | Page number (starts at 1) | 1 |
| `--page-size <number>` | Results per page | 10 |
| `--sort-by <field>` | Sort by field (prefix with `-` for descending) | — |

Examples:

```bash
off search nutella
off search "organic chocolate" --page-size 5
off search pasta --page 2
```

### Get a product by barcode

```bash
off get <ean>
```

Example:

```bash
off get 3017620422003
```

## Development

### Prerequisites

- [Bun](https://bun.sh/) runtime

### Setup

```bash
bun install
```

### Run locally

```bash
bun run src/cli.ts search nutella
```

## Dependencies

- [openfoodfacts-nodejs](https://github.com/openfoodfacts/openfoodfacts-js) — Official JavaScript SDK for OpenFoodFacts
- [Commander.js](https://github.com/tj/commander.js) — CLI framework
