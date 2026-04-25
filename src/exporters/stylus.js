/**
 * Export palette as Stylus variables or a Stylus hash.
 */

/**
 * Convert [r, g, b] to hex string.
 * @param {number[]} rgb
 * @returns {string}
 */
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitize a color name to a valid Stylus identifier.
 * @param {string} name
 * @returns {string}
 */
function toStylusIdent(name) {
  return name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
}

/**
 * Export palette as Stylus variable assignments.
 * @param {Array<{name: string, rgb: number[]}>} annotated
 * @returns {string}
 */
function exportStylusVariables(annotated) {
  const lines = annotated.map(({ name, rgb }) => {
    return `${toStylusIdent(name)} = ${rgbToHex(rgb)}`;
  });
  return lines.join('\n') + '\n';
}

/**
 * Export palette as a Stylus hash object.
 * @param {Array<{name: string, rgb: number[]}>} annotated
 * @param {string} [hashName='palette']
 * @returns {string}
 */
function exportStylusHash(annotated, hashName = 'palette') {
  const entries = annotated.map(({ name, rgb }) => {
    const key = toStylusIdent(name);
    return `  ${key}: ${rgbToHex(rgb)}`;
  });
  return `${hashName} = {\n${entries.join('\n')}\n}\n`;
}

module.exports = { rgbToHex, toStylusIdent, exportStylusVariables, exportStylusHash };
