import { EmitterSpec } from "./emitter";

const COORDINATES_KEY = "LojboLanciKantu.Particle.EmitterCoordinates";
const EMITTER_TYPE_KEY = "LojboLanciKantu.CreateEmitter.EmitterType";

export function saveEmitters(specs: EmitterSpec[]): void {
  localStorage.setItem(COORDINATES_KEY, JSON.stringify(specs));
}

export function getSavedEmitters(): undefined | EmitterSpec[] {
  const savedString = localStorage.getItem(COORDINATES_KEY);
  if (savedString === null) {
    return undefined;
  } else {
    return JSON.parse(savedString);
  }
}

export function saveEmitterType(type: 0 | 1) {
  localStorage.setItem(EMITTER_TYPE_KEY, JSON.stringify(type));
}

export function getSavedEmitterType(): undefined | 0 | 1 {
  const s = localStorage.getItem(EMITTER_TYPE_KEY);
  if (s === null) {
    return undefined;
  } else {
    const n = parseInt(s, 10);
    if (n === 0 || n === 1) {
      return n;
    } else {
      return undefined;
    }
  }
}
