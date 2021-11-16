import { EmitterSpec } from "../emitter";

// o'a

const DX = -100;
const DY = 0;

const SCALE = 6;

const RAW: EmitterSpec[] = [
  { type: 0, x: 211, y: 113 },
  { type: 0, x: 176, y: 119 },
  { type: 0, x: 158, y: 144 },
  { type: 0, x: 159, y: 172 },
  { type: 0, x: 174, y: 195 },
  { type: 0, x: 200, y: 210 },
  { type: 0, x: 228, y: 209 },
  { type: 0, x: 249, y: 193 },
  { type: 0, x: 266, y: 170 },
  { type: 0, x: 258, y: 147 },
  { type: 0, x: 237, y: 117 },
  { type: 0, x: 334, y: 40 },
  { type: 0, x: 335, y: 70 },
  { type: 0, x: 398, y: 181 },
  { type: 0, x: 428, y: 176 },
  { type: 0, x: 460, y: 185 },
  { type: 0, x: 476, y: 209 },
  { type: 0, x: 454, y: 223 },
  { type: 0, x: 422, y: 231 },
  { type: 0, x: 391, y: 224 },
  { type: 0, x: 373, y: 192 },
  { type: 0, x: 482, y: 177 },
  { type: 0, x: 482, y: 145 },
  { type: 0, x: 455, y: 120 },
  { type: 0, x: 423, y: 115 },
  { type: 0, x: 396, y: 121 },
  { type: 0, x: 376, y: 129 },
  { type: 0, x: 479, y: 237 },
];

export const _21: EmitterSpec[] = RAW.map((e) => ({
  type: e.type,
  x: e.x * SCALE + DX,
  y: e.y * SCALE + DY,
}));
