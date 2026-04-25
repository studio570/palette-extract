/**
 * Swift / iOS color exporter
 * Exports palette as Swift UIColor / SwiftUI Color extensions
 */

/**
 * Convert 0-255 RGB to 0.0-1.0 float string
 * @param {number} value
 * @returns {string}
 */
function toSwiftFloat(value) {
  return (value / 255).toFixed(4);
}

/**
 * Export palette as a Swift UIColor extension
 * @param {Array<{name: string, rgb: [number, number, number]}>} annotatedPalette
 * @param {string} [extensionName='Palette']
 * @returns {string}
 */
function exportSwiftUIColor(annotatedPalette, extensionName = 'Palette') {
  const colors = annotatedPalette.map(({ name, rgb }) => {
    const [r, g, b] = rgb;
    const swiftName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return `    static let ${swiftName} = UIColor(red: ${toSwiftFloat(r)}, green: ${toSwiftFloat(g)}, blue: ${toSwiftFloat(b)}, alpha: 1.0)`;
  });

  return [
    'import UIKit',
    '',
    `extension UIColor {`,
    `  enum ${extensionName} {`,
    ...colors,
    '  }',
    '}',
    ''
  ].join('\n');
}

/**
 * Export palette as a SwiftUI Color extension
 * @param {Array<{name: string, rgb: [number, number, number]}>} annotatedPalette
 * @param {string} [extensionName='Palette']
 * @returns {string}
 */
function exportSwiftUIColorSwiftUI(annotatedPalette, extensionName = 'Palette') {
  const colors = annotatedPalette.map(({ name, rgb }) => {
    const [r, g, b] = rgb;
    const swiftName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return `    static let ${swiftName} = Color(red: ${toSwiftFloat(r)}, green: ${toSwiftFloat(g)}, blue: ${toSwiftFloat(b)})`;
  });

  return [
    'import SwiftUI',
    '',
    `extension Color {`,
    `  enum ${extensionName} {`,
    ...colors,
    '  }',
    '}',
    ''
  ].join('\n');
}

module.exports = { toSwiftFloat, exportSwiftUIColor, exportSwiftUIColorSwiftUI };
