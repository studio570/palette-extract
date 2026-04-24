/**
 * Adobe Swatch Exchange (ASE) exporter
 * Exports color palettes to .ase binary format compatible with Adobe apps
 */

const ASE_SIGNATURE = 0x41534546; // 'ASEF'
const ASE_VERSION = 0x00010000;
const BLOCK_GROUP_START = 0xc001;
const BLOCK_GROUP_END = 0xc002;
const BLOCK_COLOR = 0x0001;
const COLOR_MODEL_RGB = 0x52474220; // 'RGB '

function writeUInt32BE(buf, value, offset) {
  buf[offset] = (value >>> 24) & 0xff;
  buf[offset + 1] = (value >>> 16) & 0xff;
  buf[offset + 2] = (value >>> 8) & 0xff;
  buf[offset + 3] = value & 0xff;
}

function writeUInt16BE(buf, value, offset) {
  buf[offset] = (value >>> 8) & 0xff;
  buf[offset + 1] = value & 0xff;
}

function writeFloat32BE(buf, value, offset) {
  const tmp = Buffer.alloc(4);
  tmp.writeFloatBE(value, 0);
  tmp.copy(buf, offset);
}

function encodeUtf16BE(str) {
  const buf = Buffer.alloc((str.length + 1) * 2);
  for (let i = 0; i < str.length; i++) {
    buf.writeUInt16BE(str.charCodeAt(i), i * 2);
  }
  buf.writeUInt16BE(0, str.length * 2); // null terminator
  return buf;
}

function buildColorBlock(name, r, g, b) {
  const nameBuf = encodeUtf16BE(name);
  const dataLen = 2 + nameBuf.length + 4 + 4 + 4 + 4 + 2;
  const block = Buffer.alloc(2 + 4 + dataLen);
  let offset = 0;

  writeUInt16BE(block, BLOCK_COLOR, offset); offset += 2;
  writeUInt32BE(block, dataLen, offset); offset += 4;
  writeUInt16BE(block, name.length + 1, offset); offset += 2;
  nameBuf.copy(block, offset); offset += nameBuf.length;
  writeUInt32BE(block, COLOR_MODEL_RGB, offset); offset += 4;
  writeFloat32BE(block, r / 255, offset); offset += 4;
  writeFloat32BE(block, g / 255, offset); offset += 4;
  writeFloat32BE(block, b / 255, offset); offset += 4;
  writeUInt16BE(block, 0, offset); // color type: global

  return block;
}

function exportAse(palette, groupName = 'Palette') {
  const colorBlocks = palette.map((color, i) => {
    const name = color.name || `Color ${i + 1}`;
    return buildColorBlock(name, color.r, color.g, color.b);
  });

  const groupNameBuf = encodeUtf16BE(groupName);
  const groupStartData = Buffer.alloc(2 + groupNameBuf.length);
  writeUInt16BE(groupStartData, groupName.length + 1, 0);
  groupNameBuf.copy(groupStartData, 2);

  const groupStart = Buffer.alloc(6 + groupStartData.length);
  writeUInt16BE(groupStart, BLOCK_GROUP_START, 0);
  writeUInt32BE(groupStart, groupStartData.length, 2);
  groupStartData.copy(groupStart, 6);

  const groupEnd = Buffer.alloc(6);
  writeUInt16BE(groupEnd, BLOCK_GROUP_END, 0);
  writeUInt32BE(groupEnd, 0, 2);

  const totalColors = colorBlocks.reduce((sum, b) => sum + b.length, 0);
  const header = Buffer.alloc(12);
  writeUInt32BE(header, ASE_SIGNATURE, 0);
  writeUInt32BE(header, ASE_VERSION, 4);
  writeUInt32BE(header, palette.length + 2, 8); // +2 for group start/end

  return Buffer.concat([header, groupStart, ...colorBlocks, groupEnd]);
}

module.exports = { exportAse, buildColorBlock };
