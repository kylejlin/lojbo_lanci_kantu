import { EmitterSpec } from "./emitter";

const COORDINATES_KEY = "Chs2021Apparel.Particle.EmitterCoordinates";

export function saveEmitters(specs: EmitterSpec[]): void {
  localStorage.setItem(COORDINATES_KEY, JSON.stringify(specs));
}

export function getSavedEmitters(): EmitterSpec[] {
  const savedString = localStorage.getItem(COORDINATES_KEY);
  if (savedString === null) {
    return [];
  } else {
    return JSON.parse(savedString);
  }
}
