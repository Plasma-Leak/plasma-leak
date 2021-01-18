import { Level, loadLevel } from "./level";
import { Renderer } from "../render/renderer";
import { config } from "../config/config";
import { InputManager } from "./input";
import {
  EndScene,
  MainMenuScene,
  LevelScene,
  Scene,
  SceneName,
  SceneState,
} from "../render/scene";

// handles input, state, engine, etc
export class Game {
  ctx: CanvasRenderingContext2D;
  renderer: Renderer;
  inputManager: InputManager;

  scene: Scene;
  sceneName: SceneName;

  level: Level;

  constructor() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    this.ctx = canvas.getContext("2d")!;

    this.renderer = new Renderer(this.ctx);
    this.level = loadLevel(1);

    this.inputManager = new InputManager(canvas, this);

    this.scene = new LevelScene();
    this.sceneName = SceneName.Level;
    this.switchScene(SceneName.MainMenu);
  }

  handleEvent(name: string, event: MouseEvent) {
    this.scene.handleEvent(name, event, this);
  }

  loop() {
    this.scene.handleCollisions(this);
    this.scene.render(this);
    window.requestAnimationFrame(() => this.loop());
  }

  switchLevel(levelNumber: number) {
    this.scene.sceneState = SceneState.LevelWin;
    this.level = loadLevel(levelNumber);
  }

  switchScene(sceneName: SceneName) {
    this.sceneName = sceneName;
    switch (this.sceneName) {
      case SceneName.Level: {
        this.scene = new LevelScene();
        this.scene.init(this);
        break;
      }
      case SceneName.MainMenu: {
        this.scene = new MainMenuScene();
        this.scene.init(this);
        break;
      }
      case SceneName.End: {
        this.scene = new EndScene();
        this.scene.init(this);
        break;
      }
    }
  }
}
