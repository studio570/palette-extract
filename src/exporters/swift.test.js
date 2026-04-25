const { toSwiftFloat, exportSwiftUIColor, exportSwiftUIColorSwiftUI } = require('./swift');

describe('toSwiftFloat', () => {
  test('converts 0 to 0.0000', () => {
    expect(toSwiftFloat(0)).toBe('0.0000');
  });

  test('converts 255 to 1.0000', () => {
    expect(toSwiftFloat(255)).toBe('1.0000');
  });

  test('converts 128 to approx 0.5020', () => {
    expect(toSwiftFloat(128)).toBe('0.5020');
  });
});

const mockPalette = [
  { name: 'color-0', rgb: [255, 0, 0] },
  { name: 'color-1', rgb: [0, 128, 255] },
];

describe('exportSwiftUIColor', () => {
  test('includes UIKit import', () => {
    const result = exportSwiftUIColor(mockPalette);
    expect(result).toContain('import UIKit');
  });

  test('wraps in UIColor extension with default name', () => {
    const result = exportSwiftUIColor(mockPalette);
    expect(result).toContain('extension UIColor');
    expect(result).toContain('enum Palette');
  });

  test('uses custom extension name', () => {
    const result = exportSwiftUIColor(mockPalette, 'BrandColors');
    expect(result).toContain('enum BrandColors');
  });

  test('converts kebab-case names to camelCase', () => {
    const result = exportSwiftUIColor(mockPalette);
    expect(result).toContain('static let color0');
    expect(result).toContain('static let color1');
  });

  test('includes correct RGB float values', () => {
    const result = exportSwiftUIColor(mockPalette);
    expect(result).toContain('red: 1.0000, green: 0.0000, blue: 0.0000');
  });

  test('ends with newline', () => {
    const result = exportSwiftUIColor(mockPalette);
    expect(result.endsWith('\n')).toBe(true);
  });
});

describe('exportSwiftUIColorSwiftUI', () => {
  test('includes SwiftUI import', () => {
    const result = exportSwiftUIColorSwiftUI(mockPalette);
    expect(result).toContain('import SwiftUI');
  });

  test('wraps in Color extension', () => {
    const result = exportSwiftUIColorSwiftUI(mockPalette);
    expect(result).toContain('extension Color');
    expect(result).toContain('enum Palette');
  });

  test('uses SwiftUI Color constructor', () => {
    const result = exportSwiftUIColorSwiftUI(mockPalette);
    expect(result).toContain('Color(red:');
    expect(result).not.toContain('UIColor');
  });

  test('converts kebab-case names to camelCase', () => {
    const result = exportSwiftUIColorSwiftUI(mockPalette);
    expect(result).toContain('static let color0');
  });

  test('handles single color palette', () => {
    const single = [{ name: 'primary-color', rgb: [10, 20, 30] }];
    const result = exportSwiftUIColorSwiftUI(single);
    expect(result).toContain('static let primaryColor');
  });
});
