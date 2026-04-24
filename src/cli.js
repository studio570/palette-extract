#!/usr/bin/env node
/**
 * palette-extract CLI entry point
 */
const fs = require('fs');
const path = require('path');
const { extractPalette } = require('./quantize');
const { exportPalette, FORMATS } = require('./exporters/index');

/**
 * Convert raw pixel buffer (RGBA) to array of [r, g, b] triples
 * @param {Buffer|Uint8Array} buffer
 * @returns {number[][]}
 */
function pixelsToRgb(buffer) {
  const pixels = [];
  for (let i = 0; i < buffer.length; i += 4) {
    const a = buffer[i + 3];
    if (a > 128) {
      pixels.push([buffer[i], buffer[i + 1], buffer[i + 2]]);
    }
  }
  return pixels;
}

function printHelp() {
  console.log(`
palette-extract — extract dominant color palettes from images

Usage:
  palette-extract <image> [options]

Options:
  --colors, -c <n>       Number of colors to extract (default: 6)
  --format, -f <fmt>     Output format (default: css)
  --output, -o <file>    Write output to file instead of stdout
  --swatch-width <n>     SVG swatch width in px (default: 100)
  --swatch-height <n>    SVG swatch height in px (default: 100)
  --no-labels            Hide hex labels in SVG output
  --columns <n>          Columns for svg-grid format (default: 4)
  --help, -h             Show this help message

Supported formats:
  ${FORMATS.join(', ')}

Examples:
  palette-extract photo.png --colors 8 --format css
  palette-extract photo.png --format svg --output swatches.svg
  palette-extract photo.png --format svg-grid --columns 3
  palette-extract photo.png --format tailwind-json --output palette.json
`);
}

function parseArgs(argv) {
  const args = { colors: 6, format: 'css', output: null, image: null, options: {} };
  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') { printHelp(); process.exit(0); }
    else if (arg === '--colors' || arg === '-c') { args.colors = parseInt(argv[++i], 10); }
    else if (arg === '--format' || arg === '-f') { args.format = argv[++i]; }
    else if (arg === '--output' || arg === '-o') { args.output = argv[++i]; }
    else if (arg === '--swatch-width') { args.options.swatchWidth = parseInt(argv[++i], 10); }
    else if (arg === '--swatch-height') { args.options.swatchHeight = parseInt(argv[++i], 10); }
    else if (arg === '--no-labels') { args.options.showLabels = false; }
    else if (arg === '--columns') { args.options.columns = parseInt(argv[++i], 10); }
    else if (!arg.startsWith('-') && !args.image) { args.image = arg; }
    i++;
  }
  return args;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) { printHelp(); process.exit(1); }

  const args = parseArgs(argv);

  if (!args.image) {
    console.error('Error: No image file specified.');
    process.exit(1);
  }

  if (!fs.existsSync(args.image)) {
    console.error(`Error: File not found: ${args.image}`);
    process.exit(1);
  }

  let pixels;
  try {
    // Attempt to use jimp if available; otherwise expect raw RGBA buffer file
    const Jimp = require('jimp');
    const img = await Jimp.read(args.image);
    pixels = pixelsToRgb(img.bitmap.data);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.error('Error: Install "jimp" to decode images: npm install jimp');
      process.exit(1);
    }
    console.error(`Error reading image: ${e.message}`);
    process.exit(1);
  }

  const palette = extractPalette(pixels, args.colors);
  const output = exportPalette(palette, args.format, args.options);

  if (args.output) {
    fs.writeFileSync(args.output, output, 'utf8');
    console.error(`Written to ${args.output}`);
  } else {
    process.stdout.write(output + '\n');
  }
}

main().catch(err => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});

module.exports = { pixelsToRgb, printHelp };
