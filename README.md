# palette-extract

> CLI tool to extract dominant color palettes from images and export to various design token formats

## Installation

```bash
npm install -g palette-extract
```

## Usage

Extract a color palette from an image and export it as design tokens:

```bash
palette-extract input.png --format css --output tokens.css
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--format` | Output format (`css`, `json`, `scss`, `figma`) | `json` |
| `--colors` | Number of colors to extract | `5` |
| `--output` | Output file path | stdout |

### Example Output

```css
/* tokens.css */
--color-primary: #2d3e50;
--color-secondary: #e74c3c;
--color-accent: #f39c12;
--color-light: #ecf0f1;
--color-dark: #1a252f;
```

### Supported Formats

- **CSS** – Custom properties
- **SCSS** – Sass variables
- **JSON** – Raw token object
- **Figma** – Figma-compatible token structure

## Contributing

Pull requests are welcome. Please open an issue first to discuss any major changes.

## License

[MIT](LICENSE)