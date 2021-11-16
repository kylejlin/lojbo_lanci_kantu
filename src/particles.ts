import {
  getType0Emitter,
  getType1Emitter,
  Emitter,
  EmitterSpec,
  fromSpec,
} from "./emitter";
import * as presets from "./presets";

export function startAnimationLoop(
  canvas: HTMLCanvasElement,
  addedEmitters: EmitterSpec[]
): SceneModifier {
  const TAU = 2 * Math.PI;

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const ctx = canvas.getContext("2d")!;
  const emitters: Emitter[] = addedEmitters.map(fromSpec);
  const particles: Particle[] = [];
  let paused = false;
  let shouldEmit = true;

  function main(): void {
    addEventListeners();
    tick();
  }

  function addEventListeners(): void {
    window.addEventListener("keydown", function (event: KeyboardEvent): void {
      if (event.key === " ") {
        paused = false;
      }
    });
    window.addEventListener("keyup", function (event: KeyboardEvent): void {
      if (event.key === " ") {
        paused = true;
      }
    });
    window.addEventListener("keypress", function (event: KeyboardEvent): void {
      if (event.key === "p") {
        shouldEmit = !shouldEmit;
      }
    });
  }

  function tick(): void {
    if (!paused) {
      if (shouldEmit) {
        emitParticles();
      }
      moveParticles();
      draw();
    }

    requestAnimationFrame(tick);
  }

  function emitParticles(): void {
    const len = emitters.length;
    for (let i = 0; i < len; ++i) {
      const emitter = emitters[i];
      const newParticles = emitter.emit();
      particles.push(...newParticles);
    }
  }

  function moveParticles(): void {
    let len = particles.length;
    for (let i = 0; i < len; ++i) {
      const p = particles[i];

      p.a += p.va;

      if (p.a <= 0) {
        particles.splice(i, 1);
        --i;
        --len;
        continue;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx += p.ax;
      p.vy += p.ay;

      p.radius += p.vRadius;

      p.r += p.vr;
      p.g += p.vg;
      p.b += p.vb;
    }
  }

  function draw(): void {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawParticles();
  }

  function drawParticles(): void {
    const len = particles.length;
    for (let i = 0; i < len; ++i) {
      const p = particles[i];
      ctx.fillStyle = getStyle(p);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, TAU);
      ctx.closePath();
      ctx.fill();
    }
  }

  main();

  return getSceneModifier();

  function getSceneModifier(): SceneModifier {
    return {
      pushEmitter,
      popEmitter,
      loadPreset,
      invertEmitterTypes,
      getEmitterSpecs,
    };

    function pushEmitter(type: 0 | 1, x: number, y: number): void {
      switch (type) {
        case 0:
          emitters.push(getType0Emitter(x, y));
          break;
        case 1:
          emitters.push(getType1Emitter(x, y));
          break;
        default:
          throw new TypeError("Unknown emitter type: " + type);
      }
    }

    function popEmitter(): void {
      emitters.pop();
    }

    function loadPreset(type: EmitterPreset): EmitterSpec[] {
      let specs: EmitterSpec[];
      switch (type) {
        case "lojbo_lanci":
          specs = presets.lojbo_lanci;
          break;
        case "ohasai":
          specs = presets.ohasai;
          break;
      }
      writeSpecs(specs);
      return specs;
    }

    function writeSpecs(specs: EmitterSpec[]): void {
      const newEmitters = specs.map(fromSpec);
      emitters.splice(0, emitters.length, ...newEmitters);
    }

    function invertEmitterTypes(): void {
      const len = emitters.length;
      for (let i = 0; i < len; ++i) {
        const original = emitters[i];
        const invertedType = invertType(original.spec.type);
        const newSpec = {
          type: invertedType,
          x: original.spec.x,
          y: original.spec.y,
        };
        const newEmitter = fromSpec(newSpec);
        emitters[i] = newEmitter;
      }
    }

    function invertType(type: 0 | 1): 0 | 1 {
      switch (type) {
        case 0:
          return 1;
        case 1:
          return 0;
      }
    }

    function getEmitterSpecs(): EmitterSpec[] {
      return emitters.map((e) => e.spec);
    }
  }
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;

  radius: number;
  vRadius: number;

  r: number;
  g: number;
  b: number;
  a: number;
  vr: number;
  vg: number;
  vb: number;
  va: number;
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function getStyle(color: Rgba): string {
  return (
    "rgba(" +
    color.r +
    "," +
    color.g +
    "," +
    color.b +
    "," +
    color.a / 255 +
    ")"
  );
}

export type EmitterPreset = "lojbo_lanci" | "ohasai";

export interface SceneModifier {
  pushEmitter(type: 0 | 1, localX: number, localy: number): void;
  popEmitter(): void;
  loadPreset(type: EmitterPreset): EmitterSpec[];
  invertEmitterTypes(): void;
  getEmitterSpecs(): EmitterSpec[];
}
