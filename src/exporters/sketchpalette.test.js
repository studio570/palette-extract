const {
  rgbToSketchColor,
  exportSketchPalette,
  exportSketchSwatches,
} = require("./sketchpalette");

const samplePalette = [
  { name: "color-1", rgb: [255, 0, 0] },
  { name: "color-2", rgb: [0, 128, 255] },
  { name: "color-3", rgb: [34, 34, 34] },
];

describe("rgbToSketchColor", () => {
  test("converts white correctly", () => {
    expect(rgbToSketchColor([255, 255, 255])).toEqual({
      red: 1,
      green: 1,
      blue: 1,
      alpha: 1,
    });
  });

  test("converts black correctly", () => {
    expect(rgbToSketchColor([0, 0, 0])).toEqual({
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1,
    });
  });

  test("converts mid-range values correctly", () => {
    const result = rgbToSketchColor([0, 128, 255]);
    expect(result.red).toBeCloseTo(0);
    expect(result.green).toBeCloseTo(0.502, 2);
    expect(result.blue).toBeCloseTo(1);
    expect(result.alpha).toBe(1);
  });
});

describe("exportSketchPalette", () => {
  test("returns valid JSON string", () => {
    const output = exportSketchPalette(samplePalette);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  test("includes correct compatibleVersion", () => {
    const parsed = JSON.parse(exportSketchPalette(samplePalette));
    expect(parsed.compatibleVersion).toBe("2.0");
  });

  test("includes correct number of colors", () => {
    const parsed = JSON.parse(exportSketchPalette(samplePalette));
    expect(parsed.colors).toHaveLength(3);
  });

  test("first color is red", () => {
    const parsed = JSON.parse(exportSketchPalette(samplePalette));
    expect(parsed.colors[0]).toEqual({ red: 1, green: 0, blue: 0, alpha: 1 });
  });
});

describe("exportSketchSwatches", () => {
  test("returns valid JSON string", () => {
    const output = exportSketchSwatches(samplePalette);
    expect(() => JSON.parse(output)).not.toThrow();
  });

  test("includes colorNames array", () => {
    const parsed = JSON.parse(exportSketchSwatches(samplePalette));
    expect(parsed.colorNames).toEqual(["color-1", "color-2", "color-3"]);
  });

  test("includes correct number of colors", () => {
    const parsed = JSON.parse(exportSketchSwatches(samplePalette));
    expect(parsed.colors).toHaveLength(3);
  });

  test("uses v1 compatibleVersion", () => {
    const parsed = JSON.parse(exportSketchSwatches(samplePalette));
    expect(parsed.compatibleVersion).toBe("1.0");
  });
});
