/**
 * Core UI / Bootstrap CSS custom properties exporter
 * Exports palette as Bootstrap-compatible CSS variable overrides
 */

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToRgbString(r, g, b) {
  return `${r}, ${g}, ${b}`;
}

/**
 * Export palette as Bootstrap 5 / CoreUI CSS variable overrides
 * @param {Array<{name: string, rgb: [number,number,number]}>} annotated
 * @returns {string}
 */
function exportBootstrapOverrides(annotated) {
  const lines = [':root {'];
  for (const { name, rgb } of annotated) {
    const [r, g, b] = rgb;
    const hex = rgbToHex(r, g, b);
    const varName = name.toLowerCase().replace(/\s+/g, '-');
    lines.push(`  --bs-${varName}: ${hex};`);
    lines.push(`  --bs-${varName}-rgb: ${rgbToRgbString(r, g, b)};`);
  }
  lines.push('}');
  return lines.join('\n');
}

/**
 * Export palette as CoreUI CSS variable overrides with additional utility classes
 * @param {Array<{name: string, rgb: [number,number,number]}>} annotated
 * @returns {string}
 */
function exportCoreUiTokens(annotated) {
  const root = exportBootstrapOverrides(annotated);
  const utilities = annotated.map(({ name, rgb }) => {
    const [r, g, b] = rgb;
    const hex = rgbToHex(r, g, b);
    const cls = name.toLowerCase().replace(/\s+/g, '-');
    return [
      `.text-${cls} { color: ${hex} !important; }`,
      `.bg-${cls} { background-color: ${hex} !important; }`,
      `.border-${cls} { border-color: ${hex} !important; }`,
    ].join('\n');
  }).join('\n');
  return `${root}\n\n${utilities}`;
}

module.exports = { rgbToHex, rgbToRgbString, exportBootstrapOverrides, exportCoreUiTokens };
