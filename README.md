# openfoodfacts-cli

Command-line interface for the [OpenFoodFacts API](https://world.openfoodfacts.org/), ready for AI agents.

## Installation

```bash
npm install -g openfoodfacts-cli
```

## Usage

### Global options

| Flag | Description | Default |
|------|-------------|---------|
| `--lang <code>` | 2-letter ISO 639-1 language code for category names (e.g. `en`, `it`, `fr`). Validated against supported codes. | `en` |
| `--no-color` | Disable colored output and emoji. Also respects the `NO_COLOR` env variable. | — |

### List supported languages

```bash
off languages
```

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
| `--no-truncate` | Show full column values without truncation | — |

Examples:

```bash
off search nutella
off search "organic chocolate" --page-size 5
off search pasta --page 2
off --lang it search nutella
off search nutella --no-truncate
```

### Get a product by barcode

Returns product details in a vertical label/value format (no truncation).

```bash
off get <ean>
```

Examples:

```bash
off get 3017620422003
off --lang fr get 3017620422003
```

Sample output:

```
Barcode             3017620422003
Name                Nutella
Brand               Ferrero
Categories          Spreads, Chocolate spreads, Hazelnut spreads
Nutriscore          E
Energy (kcal/100g)  539
Fat (g/100g)        30.9
Carbs (g/100g)      57.5
Proteins (g/100g)   6.3
Salt (g/100g)       0.1
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
