/**
 * OpenType / CSS Font Color (COLR) palette export
 * Exports palette as CSS custom properties and as a
 * font-palette override block for use with @font-palette-values.
 */

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Export palette as CSS @font-palette-values override.
 * @param {Array<{name:string, rgb:[number,number,number]}>} annotated
 * @param {object} options
 * @param {string} [options.fontFamily='MyFont']
 * @param {string} [options.paletteName='--custom-palette']
 * @returns {string}
 */
function exportFontPaletteValues(annotated, options = {}) {
  const fontFamily = options.fontFamily || 'MyFont';
  const paletteName = options.paletteName || '--custom-palette';

  const overrides = annotated
    .map((entry, i) => `  override-colors: ${i} ${rgbToHex(...entry.rgb)};`)
    .join('\n');

  return [
    `@font-palette-values ${paletteName} {`,
    `  font-family: ${fontFamily};`,
    `  base-palette: 0;`,
    overrides,
    `}`,
  ].join('\n');
}

/**
 * Export palette as CSS custom properties scoped to a selector.
 * @param {Array<{name:string, rgb:[number,number,number]}>} annotated
 * @param {object} options
 * @param {string} [options.selector=':root']
 * @param {string} [options.prefix='color']
 * @returns {string}
 */
function exportCssCustomProperties(annotated, options = {}) {
  const selector = options.selector || ':root';
  const prefix = options.prefix || 'color';

  const vars = annotated
    .map(entry => `  --${prefix}-${entry.name}: ${rgbToHex(...entry.rgb)};`)
    .join('\n');

  return `${selector} {\n${vars}\n}`;
}

module.exports = { rgbToHex, exportFontPaletteValues, exportCssCustomProperties };
