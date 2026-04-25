/**
 * Kotlin / Android Compose color exporter
 * Exports palette as Kotlin Color constants for Jetpack Compose
 */

/**
 * Convert RGB to 0xAARRGGBB hex string for Kotlin
 * @param {[number, number, number]} rgb
 * @returns {string}
 */
function rgbToKotlinHex(rgb) {
  const [r, g, b] = rgb;
  const hex = ((r << 16) | (g << 8) | b).toString(16).toUpperCase().padStart(6, '0');
  return `0xFF${hex}`;
}

/**
 * Convert kebab-case or snake_case name to SCREAMING_SNAKE_CASE
 * @param {string} name
 * @returns {string}
 */
function toScreamingSnake(name) {
  return name.replace(/-/g, '_').toUpperCase();
}

/**
 * Export palette as Kotlin Compose Color object
 * @param {Array<{name: string, rgb: [number, number, number]}>} annotatedPalette
 * @param {string} [objectName='PaletteColors']
 * @returns {string}
 */
function exportComposeColors(annotatedPalette, objectName = 'PaletteColors') {
  const colors = annotatedPalette.map(({ name, rgb }) => {
    const constName = toScreamingSnake(name);
    return `    val ${constName} = Color(${rgbToKotlinHex(rgb)})`;
  });

  return [
    'import androidx.compose.ui.graphics.Color',
    '',
    `object ${objectName} {`,
    ...colors,
    '}',
    ''
  ].join('\n');
}

/**
 * Export palette as a Kotlin data class with color properties
 * @param {Array<{name: string, rgb: [number, number, number]}>} annotatedPalette
 * @param {string} [className='ColorPalette']
 * @returns {string}
 */
function exportComposeColorScheme(annotatedPalette, className = 'ColorPalette') {
  const params = annotatedPalette.map(({ name, rgb }) => {
    const propName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    return `    val ${propName}: Color = Color(${rgbToKotlinHex(rgb)})`;
  });

  return [
    'import androidx.compose.ui.graphics.Color',
    '',
    `data class ${className}(`,
    params.join(',\n'),
    ')',
    ''
  ].join('\n');
}

module.exports = { rgbToKotlinHex, toScreamingSnake, exportComposeColors, exportComposeColorScheme };
