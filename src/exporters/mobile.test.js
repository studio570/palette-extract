/**
 * Integration tests for mobile platform exporters (Swift + Kotlin)
 */
const { exportSwiftUIColor, exportSwiftUIColorSwiftUI } = require('./swift');
const { exportComposeColors, exportComposeColorScheme } = require('./kotlin');

const samplePalette = [
  { name: 'color-0', rgb: [220, 38, 38] },
  { name: 'color-1', rgb: [37, 99, 235] },
  { name: 'color-2', rgb: [5, 150, 105] },
  { name: 'color-3', rgb: [245, 158, 11] },
];

describe('Mobile exporters integration', () => {
  test('Swift UIColor and SwiftUI Color produce consistent color values', () => {
    const uiColor = exportSwiftUIColor(samplePalette);
    const swiftUI = exportSwiftUIColorSwiftUI(samplePalette);
    // Both should have same float values for same palette
    expect(uiColor).toContain('red: 0.8627');
    expect(swiftUI).toContain('red: 0.8627');
  });

  test('Kotlin Compose object has same number of entries as palette', () => {
    const result = exportComposeColors(samplePalette);
    const valCount = (result.match(/val COLOR_/g) || []).length;
    expect(valCount).toBe(samplePalette.length);
  });

  test('Swift output has same number of color entries as palette', () => {
    const result = exportSwiftUIColor(samplePalette);
    const staticCount = (result.match(/static let/g) || []).length;
    expect(staticCount).toBe(samplePalette.length);
  });

  test('both platforms handle empty palette gracefully', () => {
    expect(() => exportSwiftUIColor([])).not.toThrow();
    expect(() => exportComposeColors([])).not.toThrow();
    expect(() => exportSwiftUIColorSwiftUI([])).not.toThrow();
    expect(() => exportComposeColorScheme([])).not.toThrow();
  });

  test('Swift output is valid-looking Swift syntax', () => {
    const result = exportSwiftUIColor(samplePalette);
    expect(result).toMatch(/^import UIKit/);
    expect(result).toMatch(/extension UIColor \{/);
    expect(result).toMatch(/\}\n$/);
  });

  test('Kotlin output is valid-looking Kotlin syntax', () => {
    const result = exportComposeColors(samplePalette);
    expect(result).toMatch(/^import androidx\.compose\.ui\.graphics\.Color/);
    expect(result).toMatch(/object PaletteColors \{/);
    expect(result).toMatch(/\}\n$/);
  });

  test('all color names are unique across both exports', () => {
    const swiftResult = exportSwiftUIColor(samplePalette);
    const kotlinResult = exportComposeColors(samplePalette);
    const swiftNames = [...swiftResult.matchAll(/static let (\w+)/g)].map(m => m[1]);
    const kotlinNames = [...kotlinResult.matchAll(/val (\w+)/g)].map(m => m[1]);
    expect(new Set(swiftNames).size).toBe(swiftNames.length);
    expect(new Set(kotlinNames).size).toBe(kotlinNames.length);
  });
});
