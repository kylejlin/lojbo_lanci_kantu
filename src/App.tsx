import React from "react";
import "./App.css";
import { EmitterSpec } from "./emitter";
import { EmitterPreset, SceneModifier, startAnimationLoop } from "./particles";
import { getSavedEmitters, saveEmitters } from "./saveEmitters";

export class App extends React.Component<{}, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: {}) {
    super(props);

    // @ts-ignore
    window.app = this;

    this.state = {
      addedEmitters: getSavedEmitters(),
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
        this.loadPreset("seniors");
      } else if (event.key === "2") {
        this.loadPreset("21");
      } else if (event.key === "3") {
        this.loadPreset("cupertino");
      } else if (event.key === "4") {
        this.loadPreset("high");
      } else if (event.key === "5") {
        this.loadPreset("school");
      } else if (event.key === "6") {
        this.loadPreset("ring");
      } else if (event.key === "7") {
        this.loadPreset("2021");
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
        <canvas
          ref={this.canvasRef}
          width={5000}
          height={2000}
          style={{ width: 5000 / 4, height: 2000 / 4 }}
          onClick={this.onCanvasClick}
        ></canvas>
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
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      this.addEmitterIfNeeded(localX, localY);
    }
  }

  addEmitterIfNeeded(localX: number, localY: number): void {
    const emitterType = 1;
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
  addedEmitters: EmitterSpec[];
  shouldAddEmitter: boolean;
  sceneModifier: undefined | SceneModifier;
}
