const { exportAse, buildColorBlock } = require('./ase');

describe('buildColorBlock', () => {
  test('returns a Buffer', () => {
    const block = buildColorBlock('Red', 255, 0, 0);
    expect(Buffer.isBuffer(block)).toBe(true);
  });

  test('block starts with color block type 0x0001', () => {
    const block = buildColorBlock('Test', 128, 64, 32);
    expect(block.readUInt16BE(0)).toBe(0x0001);
  });

  test('block contains RGB model identifier', () => {
    const block = buildColorBlock('Blue', 0, 0, 255);
    // RGB model is after block type (2), length (4), name length (2), name bytes
    // name 'Blue' = 5 chars (including null) * 2 = 10 bytes
    const modelOffset = 2 + 4 + 2 + 10;
    expect(block.readUInt32BE(modelOffset)).toBe(0x52474220);
  });
});

describe('exportAse', () => {
  const palette = [
    { r: 255, g: 0, b: 0, name: 'Red' },
    { r: 0, g: 255, b: 0, name: 'Green' },
    { r: 0, g: 0, b: 255, name: 'Blue' },
  ];

  test('returns a Buffer', () => {
    const result = exportAse(palette);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  test('starts with ASEF signature', () => {
    const result = exportAse(palette);
    expect(result.readUInt32BE(0)).toBe(0x41534546);
  });

  test('has correct version 1.0', () => {
    const result = exportAse(palette);
    expect(result.readUInt32BE(4)).toBe(0x00010000);
  });

  test('block count includes colors plus group start/end', () => {
    const result = exportAse(palette);
    const blockCount = result.readUInt32BE(8);
    expect(blockCount).toBe(palette.length + 2);
  });

  test('works with unnamed colors using fallback names', () => {
    const unnamed = [
      { r: 100, g: 150, b: 200 },
      { r: 50, g: 75, b: 100 },
    ];
    expect(() => exportAse(unnamed)).not.toThrow();
    const result = exportAse(unnamed);
    expect(Buffer.isBuffer(result)).toBe(true);
  });

  test('accepts custom group name', () => {
    expect(() => exportAse(palette, 'Brand Colors')).not.toThrow();
  });

  test('handles single color palette', () => {
    const single = [{ r: 255, g: 255, b: 255, name: 'White' }];
    const result = exportAse(single);
    expect(result.readUInt32BE(8)).toBe(3); // 1 color + group start + group end
  });

  test('handles empty palette', () => {
    const result = exportAse([]);
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result.readUInt32BE(8)).toBe(2); // only group start + group end
  });
});
