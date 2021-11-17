import React from "react";
import "./App.css";
import { EmitterSpec } from "./emitter";
import { EmitterPreset, SceneModifier, startAnimationLoop } from "./particles";
import {
  getSavedEmitters,
  saveEmitters,
  getSavedEmitterType,
  saveEmitterType,
} from "./persistentState";
import * as presets from "./presets";

export class App extends React.Component<{}, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: {}) {
    super(props);

    // @ts-ignore
    window.app = this;

    this.state = {
      emitterType: getSavedEmitterType() ?? 0,
      addedEmitters: getSavedEmitters() ?? getDefaultEmitters(),
      shouldAddEmitter: false,
      sceneModifier: undefined,
    };

    this.canvasRef = React.createRef();

    this.bindMethods();
  }

  bindMethods(): void {
    this.onCanvasClick = this.onCanvasClick.bind(this);
  }

  componentDidMount(): void {
    this.addEventListeners();
    this.startAnimationLoop();
  }

  startAnimationLoop(): void {
    const canvas = this.canvasRef.current;
    if (canvas === null) {
      throw new Error("Cannot find canvas.");
    }
    const modifier = startAnimationLoop(canvas, this.state.addedEmitters);
    this.setState({ sceneModifier: modifier });
  }

  addEventListeners(): void {
    window.addEventListener("keydown", (event: KeyboardEvent): void => {
      if (event.key === "e") {
        this.setState({ shouldAddEmitter: true });
      } else if (event.key === "1") {
        this.loadPreset("lojbo_lanci");
      } else if (event.key === "2") {
        this.loadPreset("ohasai");
      } else if (event.key === "[") {
        this.decreaseEmitterType();
      } else if (event.key === "]") {
        this.increaseEmitterType();
      }
    });
    window.addEventListener("keyup", (event: KeyboardEvent): void => {
      if (event.key === "e") {
        this.setState({ shouldAddEmitter: false });
      }
    });

    window.addEventListener("keypress", (event: KeyboardEvent): void => {
      if (event.key === "r") {
        this.removeEmitter();
      } else if (event.key === "t") {
        const { sceneModifier } = this.state;
        if (sceneModifier !== undefined) {
          sceneModifier.invertEmitterTypes();
          const newSpecs = sceneModifier.getEmitterSpecs();
          this.setState({ addedEmitters: newSpecs });
          saveEmitters(newSpecs);
        }
      }
    });
  }

  loadPreset(preset: EmitterPreset): void {
    const specs = this.state.sceneModifier?.loadPreset(preset);
    if (specs !== undefined) {
      this.setState({ addedEmitters: specs });
      saveEmitters(specs);
    }
  }

  decreaseEmitterType(): void {
    const newEmitterType: 0 | 1 = (this.state.emitterType === 0
      ? 1
      : this.state.emitterType - 1) as 0 | 1;
    this.setState({
      emitterType: newEmitterType,
    });
    saveEmitterType(newEmitterType);
  }

  increaseEmitterType(): void {
    const newEmitterType: 0 | 1 = (this.state.emitterType === 1
      ? 0
      : this.state.emitterType + 1) as 0 | 1;
    this.setState({
      emitterType: newEmitterType,
    });
    saveEmitterType(newEmitterType);
  }

  removeEmitter(): void {
    if (this.state.addedEmitters.length > 0) {
      this.setState(
        (prevState) => {
          const newEmitters = prevState.addedEmitters.slice(0, -1);
          saveEmitters(newEmitters);
          return {
            addedEmitters: newEmitters,
          };
        },
        () => {
          this.state.sceneModifier?.popEmitter();
        }
      );
    } else {
      alert("No user-added emitters to remove.");
    }
  }

  render(): React.ReactElement {
    return (
      <div className="App">
        <section>
          <h1>Lojbanic Flag Particle Playground</h1>
          <p>Scroll down for instructions.</p>
          <p>
            Warning: This can be a CPU-intensive web app, so for best results, I
            don't recommend using it on an old computer.
          </p>
        </section>
        <canvas
          ref={this.canvasRef}
          width={7000}
          height={2000}
          style={{ width: 7000 / 4, height: 2000 / 4 }}
          onClick={this.onCanvasClick}
        ></canvas>
        <section>
          <h2>Instructions</h2>
          <ul>
            <li>
              Press <span className="Key">1</span> to load the Lojbanic flag
              preset. This will overwrite all existing work.
            </li>
            <li>
              Press <span className="Key">2</span> to load the "o'asai" preset.
              This will overwrite all existing work.
            </li>
            <li>
              Hold <span className="Key">E</span> and click to add a particle
              emitter.
            </li>
            <li>
              Press <span className="Key">R</span> to remove the most recently
              added particle emitter.
            </li>
            <li>
              Press <span className="Key">[</span> to switch the particle
              emitter type. This will only take effect starting with the next
              added emitter.
            </li>
            <li>
              Press <span className="Key">Space</span> to pause the animation.
              <ul>
                <li>
                  Once paused, the animation can be resumed by holding down
                  <span className="Key">Space</span>.
                </li>
                <li>
                  The animation will resume while{" "}
                  <span className="Key">Space</span> is held down.
                </li>
              </ul>
            </li>
            <li>
              Press <span className="Key">T</span> to invert particle emitter
              types.
            </li>
            <li>
              To download an image of what you see on the screen, right click
              and then click "Save Image As", just as you would download an
              ordinary image.
              <ul>
                <li>
                  If you download the image as a PNG, the background of the
                  downloaded image will be transparent.
                </li>
              </ul>
            </li>
          </ul>
        </section>
        <footer>
          <p>
            This web app was created by{" "}
            <a href="https://github.com/kylejlin">Kyle Lin</a>. The source can
            be found{" "}
            <a href="https://github.com/kylejlin/lojbo_lanci_kantu">here</a>,
            under the MIT license.
          </p>
        </footer>
      </div>
    );
  }

  onCanvasClick(event: React.MouseEvent<HTMLCanvasElement>): void {
    const { clientX, clientY, altKey } = event;
    if (altKey) {
      this.setState(
        (prevState) => ({
          addedEmitters: prevState.addedEmitters.slice(0, -1),
        }),
        () => {
          console.log("after removal", this.state.addedEmitters);
          window.alert("Removed previous point.");
        }
      );
    } else {
      const canvas = event.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const localX = ((clientX - rect.left) * canvas.width) / rect.width;
      const localY = ((clientY - rect.top) * canvas.height) / rect.height;

      this.addEmitterIfNeeded(localX, localY);
    }
  }

  addEmitterIfNeeded(localX: number, localY: number): void {
    const { emitterType } = this.state;
    if (this.state.shouldAddEmitter) {
      this.setState(
        (prevState) => {
          const newEmitters = prevState.addedEmitters.concat([
            { type: emitterType, x: localX, y: localY },
          ]);
          saveEmitters(newEmitters);
          return {
            addedEmitters: newEmitters,
          };
        },
        () => {
          console.log("Latest emitter coordinates: ", this.state.addedEmitters);
          this.state.sceneModifier?.pushEmitter(emitterType, localX, localY);
        }
      );
    }
  }
}

export interface State {
  emitterType: 0 | 1;
  addedEmitters: EmitterSpec[];
  shouldAddEmitter: boolean;
  sceneModifier: undefined | SceneModifier;
}

function getDefaultEmitters(): EmitterSpec[] {
  return presets.lojbo_lanci;
}
