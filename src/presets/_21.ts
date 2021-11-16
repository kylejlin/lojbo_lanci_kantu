import { EmitterSpec } from "../emitter";

// Flag

const RIGHT_CIRCLE_DX = 100;

const SCALE = 2;

const RAW: EmitterSpec[] = [
  // Left circle
  { type: 0, x: 143, y: 195 },
  { type: 0, x: 156, y: 160 },
  { type: 0, x: 191, y: 137 },
  { type: 0, x: 221, y: 124 },
  { type: 0, x: 254, y: 126 },
  { type: 0, x: 283, y: 139 },
  { type: 0, x: 301, y: 158 },
  { type: 0, x: 322, y: 177 },
  { type: 0, x: 326, y: 203 },
  { type: 0, x: 323, y: 228 },
  { type: 0, x: 310, y: 256 },
  { type: 0, x: 293, y: 278 },
  { type: 0, x: 270, y: 297 },
  { type: 0, x: 242, y: 302 },
  { type: 0, x: 210, y: 295 },
  { type: 0, x: 180, y: 279 },
  { type: 0, x: 140, y: 223 },
  { type: 0, x: 149, y: 252 },
  // Right circle
  { type: 0, x: 143 + RIGHT_CIRCLE_DX, y: 195 },
  { type: 0, x: 156 + RIGHT_CIRCLE_DX, y: 160 },
  { type: 0, x: 191 + RIGHT_CIRCLE_DX, y: 137 },
  { type: 0, x: 221 + RIGHT_CIRCLE_DX, y: 124 },
  { type: 0, x: 254 + RIGHT_CIRCLE_DX, y: 126 },
  { type: 0, x: 283 + RIGHT_CIRCLE_DX, y: 139 },
  { type: 0, x: 301 + RIGHT_CIRCLE_DX, y: 158 },
  { type: 0, x: 322 + RIGHT_CIRCLE_DX, y: 177 },
  { type: 0, x: 326 + RIGHT_CIRCLE_DX, y: 203 },
  { type: 0, x: 323 + RIGHT_CIRCLE_DX, y: 228 },
  { type: 0, x: 310 + RIGHT_CIRCLE_DX, y: 256 },
  { type: 0, x: 293 + RIGHT_CIRCLE_DX, y: 278 },
  { type: 0, x: 270 + RIGHT_CIRCLE_DX, y: 297 },
  { type: 0, x: 242 + RIGHT_CIRCLE_DX, y: 302 },
  { type: 0, x: 210 + RIGHT_CIRCLE_DX, y: 295 },
  { type: 0, x: 180 + RIGHT_CIRCLE_DX, y: 279 },
  { type: 0, x: 140 + RIGHT_CIRCLE_DX, y: 223 },
  { type: 0, x: 149 + RIGHT_CIRCLE_DX, y: 252 },
  // Arrows
];

export const _21: EmitterSpec[] = RAW.map((e) => ({
  type: e.type,
  x: e.x * SCALE,
  y: e.y * SCALE,
}));
