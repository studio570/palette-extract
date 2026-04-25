/**
 * Adobe Swatch Exchange (.ase) companion: exports palettes as Adobe Color (.aco) format
 * ACO format: Photoshop Color Swatch file
 */

/**
 * Write a 16-bit unsigned integer big-endian into a buffer at offset
 */
function writeUInt16BE(buf, value, offset) {
  buf[offset] = (value >> 8) & 0xff;
  buf[offset + 1] = value & 0xff;
}

/**
 * Convert 8-bit channel to 16-bit Photoshop scale (0-65535)
 */
function to16Bit(channel) {
  return Math.round((channel / 255) * 65535);
}

/**
 * Build an Adobe Color (.aco) binary buffer from an array of RGB colors
 * Supports ACO version 1 and version 2 (with color names)
 * @param {Array<{r:number, g:number, b:number, name?:string}>} colors
 * @returns {Buffer}
 */
function exportAcoBuffer(colors) {
  const colorSpace = 0; // RGB
  const v1BlockSize = 2 + 2 + colors.length * 10;
  const v2Entries = colors.map((c, i) => {
    const name = c.name || `Color ${i + 1}`;
    // 2 (colorspace) + 8 (channels) + 2 (zero) + 2 (length) + (len+1)*2 (utf-16)
    return 2 + 8 + 2 + 2 + (name.length + 1) * 2;
  });
  const v2BlockSize = 2 + 2 + v2Entries.reduce((a, b) => a + b, 0);
  const total = v1BlockSize + v2BlockSize;
  const buf = Buffer.alloc(total, 0);
  let offset = 0;

  // Version 1 header
  writeUInt16BE(buf, 1, offset); offset += 2;
  writeUInt16BE(buf, colors.length, offset); offset += 2;

  for (const color of colors) {
    writeUInt16BE(buf, colorSpace, offset); offset += 2;
    writeUInt16BE(buf, to16Bit(color.r), offset); offset += 2;
    writeUInt16BE(buf, to16Bit(color.g), offset); offset += 2;
    writeUInt16BE(buf, to16Bit(color.b), offset); offset += 2;
    writeUInt16BE(buf, 0, offset); offset += 2; // padding
  }

  // Version 2 header
  writeUInt16BE(buf, 2, offset); offset += 2;
  writeUInt16BE(buf, colors.length, offset); offset += 2;

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    const name = color.name || `Color ${i + 1}`;
    writeUInt16BE(buf, colorSpace, offset); offset += 2;
    writeUInt16BE(buf, to16Bit(color.r), offset); offset += 2;
    writeUInt16BE(buf, to16Bit(color.g), offset); offset += 2;
    writeUInt16BE(buf, to16Bit(color.b), offset); offset += 2;
    writeUInt16BE(buf, 0, offset); offset += 2;
    writeUInt16BE(buf, 0, offset); offset += 2; // zero terminator before name
    writeUInt16BE(buf, name.length + 1, offset); offset += 2;
    for (let j = 0; j < name.length; j++) {
      writeUInt16BE(buf, name.charCodeAt(j), offset); offset += 2;
    }
    writeUInt16BE(buf, 0, offset); offset += 2; // null terminator
  }

  return buf;
}

module.exports = { to16Bit, exportAcoBuffer };
