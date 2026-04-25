const { to16Bit, exportAcoBuffer } = require('./adobe-swatch');

describe('to16Bit', () => {
  test('converts 0 to 0', () => {
    expect(to16Bit(0)).toBe(0);
  });

  test('converts 255 to 65535', () => {
    expect(to16Bit(255)).toBe(65535);
  });

  test('converts 128 approximately to midpoint', () => {
    const val = to16Bit(128);
    expect(val).toBeGreaterThan(32000);
    expect(val).toBeLessThan(33000);
  });
});

describe('exportAcoBuffer', () => {
  const palette = [
    { r: 255, g: 0, b: 0, name: 'Red' },
    { r: 0, g: 255, b: 0, name: 'Green' },
    { r: 0, g: 0, b: 255, name: 'Blue' },
  ];

  test('returns a Buffer', () => {
    const buf = exportAcoBuffer(palette);
    expect(Buffer.isBuffer(buf)).toBe(true);
  });

  test('v1 header starts with version 1', () => {
    const buf = exportAcoBuffer(palette);
    expect(buf.readUInt16BE(0)).toBe(1);
  });

  test('v1 header encodes correct color count', () => {
    const buf = exportAcoBuffer(palette);
    expect(buf.readUInt16BE(2)).toBe(palette.length);
  });

  test('v2 header starts after v1 block', () => {
    const buf = exportAcoBuffer(palette);
    const v1End = 2 + 2 + palette.length * 10;
    expect(buf.readUInt16BE(v1End)).toBe(2);
  });

  test('v2 header encodes correct color count', () => {
    const buf = exportAcoBuffer(palette);
    const v1End = 2 + 2 + palette.length * 10;
    expect(buf.readUInt16BE(v1End + 2)).toBe(palette.length);
  });

  test('first v1 color has correct red channel', () => {
    const buf = exportAcoBuffer(palette);
    // offset 4: colorspace, offset 6: red channel
    expect(buf.readUInt16BE(6)).toBe(65535);
  });

  test('first v1 color has correct green channel as 0', () => {
    const buf = exportAcoBuffer(palette);
    expect(buf.readUInt16BE(8)).toBe(0);
  });

  test('works with unnamed colors using default names', () => {
    const unnamed = [{ r: 100, g: 150, b: 200 }];
    const buf = exportAcoBuffer(unnamed);
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.readUInt16BE(2)).toBe(1);
  });

  test('buffer length is deterministic for same input', () => {
    const buf1 = exportAcoBuffer(palette);
    const buf2 = exportAcoBuffer(palette);
    expect(buf1.length).toBe(buf2.length);
  });
});
