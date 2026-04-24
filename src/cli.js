#!/usr/bin/env node

/**
 * palette-extract CLI
 * Main entry point for the command-line interface.
 * Parses arguments, loads an image, extracts a palette, and exports tokens.
 */

import { createReadStream, existsSync } from 'fs';
import { extname, resolve } from 'path';
import { parseArgs } from 'util';
import { extractPalette } from './quantize.js';
import { exportPalette } from './exporters/index.js';
import { createCanvas, loadImage } from 'canvas';

const SUPPORTED_FORMATS = ['css', 'scss', 'scss-map', 'json', 'w3c'];
const DEFAULT_COLORS = 6;
const DEFAULT_FORMAT = 'css';

/**
 * Samples pixel data from an image file using node-canvas.
 * Returns a flat Uint8ClampedArray of RGBA values.
 *
 * @param {string} imagePath - Absolute path to the image file.
 * @returns {Promise<{ data: Uint8ClampedArray, width: number, height: number }>}
 */
async function samplePixels(imagePath) {
  const img = await loadImage(imagePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  return { data: imageData.data, width: img.width, height: img.height };
}

/**
 * Converts raw RGBA pixel data into an array of [r, g, b] tuples,
 * skipping fully-transparent pixels.
 *
 * @param {Uint8ClampedArray} data
 * @returns {Array<[number, number, number]>}
 */
function pixelsToRgb(data) {
  const pixels = [];
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha < 128) continue; // skip transparent
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }
  return pixels;
}

/**
 * Prints usage information to stdout.
 */
function printHelp() {
  console.log(`
Usage: palette-extract <image> [options]

Arguments:
  image                 Path to the source image (JPEG, PNG, WebP, GIF)

Options:
  -n, --colors <num>    Number of colors to extract (default: ${DEFAULT_COLORS})
  -f, --format <fmt>    Output format: ${SUPPORTED_FORMATS.join(', ')} (default: ${DEFAULT_FORMAT})
  -o, --output <file>   Write output to file instead of stdout
  -h, --help            Show this help message
  -v, --version         Show version

Examples:
  palette-extract hero.png
  palette-extract logo.jpg --colors 8 --format scss
  palette-extract photo.png --format w3c --output tokens.json
`);
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      colors:  { type: 'string',  short: 'n', default: String(DEFAULT_COLORS) },
      format:  { type: 'string',  short: 'f', default: DEFAULT_FORMAT },
      output:  { type: 'string',  short: 'o' },
      help:    { type: 'boolean', short: 'h', default: false },
      version: { type: 'boolean', short: 'v', default: false },
    },
    allowPositionals: true,
  });

  if (values.version) {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const { version } = require('../../package.json');
    console.log(`palette-extract v${version}`);
    process.exit(0);
  }

  if (values.help || positionals.length === 0) {
    printHelp();
    process.exit(0);
  }

  const imagePath = resolve(positionals[0]);
  if (!existsSync(imagePath)) {
    console.error(`Error: File not found — ${imagePath}`);
    process.exit(1);
  }

  const numColors = parseInt(values.colors, 10);
  if (isNaN(numColors) || numColors < 1 || numColors > 64) {
    console.error('Error: --colors must be an integer between 1 and 64.');
    process.exit(1);
  }

  const format = values.format.toLowerCase();
  if (!SUPPORTED_FORMATS.includes(format)) {
    console.error(`Error: Unknown format "${format}". Supported: ${SUPPORTED_FORMATS.join(', ')}`);
    process.exit(1);
  }

  try {
    const { data } = await samplePixels(imagePath);
    const pixels = pixelsToRgb(data);

    if (pixels.length === 0) {
      console.error('Error: No opaque pixels found in image.');
      process.exit(1);
    }

    const palette = extractPalette(pixels, numColors);
    const output = exportPalette(palette, format);

    if (values.output) {
      const { writeFileSync } = await import('fs');
      const outPath = resolve(values.output);
      writeFileSync(outPath, output, 'utf8');
      console.error(`Palette written to ${outPath}`);
    } else {
      process.stdout.write(output + '\n');
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
