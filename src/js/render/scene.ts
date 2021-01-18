import { Vector } from "../calculus";
import { config } from "../config/config";
import { Entity, EntityType } from "../entity/entity";
import { Game } from "../game/game";
import { calculateStreamPath } from "../physics/physics";
import { Button } from "./button";
import { TestChargeSteps } from "./renderer";

export enum SceneName {
  SplashScreen,
  MainMenu,
  LevelSelect,
  Level,
  Leaderboard,
  End,
}

export enum SceneState {
  SceneInit,
  // Level
  LevelAddingCharge,
  LevelMovingCharge,

  LevelWin,
}

export abstract class Scene {
  buttons: Button[];
  sceneState: SceneState;
  isRecentWin: boolean;

  constructor() {
    this.sceneState = SceneState.SceneInit;
    this.buttons = [];
    this.isRecentWin = false;
  }

  abstract handleEvent(name: string, event: MouseEvent, game: Game): void;

  abstract init(game: Game): void;
  abstract render(game: Game): void;
  abstract handleCollisions(game: Game): void;
}

export class LevelScene extends Scene {
  selectedEntity: Entity;

  constructor() {
    super();
    this.selectedEntity = {} as Entity;
  }

  handleEvent(name: string, event: MouseEvent, game: Game) {
    let position = new Vector(event.offsetX, event.offsetY, 0);

    switch (name) {
      case "click": {
        console.log("click");
        for (let button of this.buttons) {
          if (button.contains(position)) {
            button.action();
            return;
          }
        }

        if (this.sceneState == SceneState.LevelAddingCharge) {
          game.level.addPoint(game.inputManager.mousePosition);
          this.sceneState = SceneState.SceneInit;
          this.clearSelected(game);
          return;
        }
        break;
      }
      case "mousedown": {
        console.log("mousedown");
        for (let e of game.level.entities) {
          if (e.contains(position)) {
            this.selectedEntity = e;
            e.isSelected = true;
            this.sceneState = SceneState.LevelMovingCharge;
            return;
          }
        }

        this.clearSelected(game);
        break;
      }
      case "mousemove": {
        if (this.sceneState == SceneState.LevelMovingCharge) {
          for (let e of game.level.entities) {
            if (e.isSelected) {
              e.position = position;
            }
          }
        }
        break;
      }
      case "mouseup": {
        console.log("mouseup");
        if (this.sceneState == SceneState.LevelMovingCharge) {
          this.clearSelected(game);
          this.sceneState = SceneState.SceneInit;
        }
      }
    }
  }

  clearSelected(game: Game) {
    for (let e of game.level.entities) {
      e.isSelected = false;
    }
  }

  init(game: Game) {
    this.buttons.push(
      new Button(
        "Add Point",
        new Vector(20, config.height - 75, 0),
        new Vector(150, 60, 0),
        () => {
          if (this.sceneState == SceneState.SceneInit) {
            this.sceneState = SceneState.LevelAddingCharge;
          } else {
            console.log("in a wierd state already?");
          }
        }
      )
    );
  }

  handleCollisions(game: Game) {
    for (let g of game.level.goals) {
      g.isSelected = false;
      g.streamCount = 0;
    }

    for (
      let streamIndex = 0;
      streamIndex < game.level.streams.length;
      streamIndex++
    ) {
      game.level.streams[streamIndex].path = calculateStreamPath(
        game,
        game.level.streams[streamIndex],
        TestChargeSteps
      );

      let doneWithStream = false;
      for (let i = 0; i < game.level.streams[streamIndex].path.length; i++) {
        let p = game.level.streams[streamIndex].path[i];

        for (let e of game.level.entities) {
          if (e.type == EntityType.Wall) {
            if (e.contains(p)) {
              game.level.streams[streamIndex].path = game.level.streams[
                streamIndex
              ].path.slice(0, i);
              doneWithStream = true;
            }
          }
        }

        if (doneWithStream) {
          break;
        }
        for (let g of game.level.goals) {
          if (g.contains(p)) {
            game.level.streams[streamIndex].path = game.level.streams[
              streamIndex
            ].path.slice(0, i);
            g.streamCount += 1;
            if (g.streamCount >= g.neededStreamCount) {
              g.isSelected = true;
            }
            doneWithStream = true;
          }
        }

        if (doneWithStream) {
          break;
        }
      }
    }

    if (
      game.level.goals.length > 0 &&
      game.level.goals.every((g) => g.isSelected)
    ) {
      if (
        game.scene.sceneState != SceneState.LevelWin &&
        !game.scene.isRecentWin
      ) {
        setTimeout(() => {
          game.scene.isRecentWin = false;

          if (game.level.id == 5) {
            game.switchScene(SceneName.End);
            return;
          }

          game.switchLevel(game.level.id + 1);
          game.scene.sceneState = SceneState.SceneInit;
        }, 1000);
      }

      if (game.scene.sceneState == SceneState.LevelAddingCharge) {
        game.level.addPoint(game.inputManager.mousePosition);
        this.sceneState = SceneState.SceneInit;
      }
      this.clearSelected(game);

      game.scene.sceneState = SceneState.LevelWin;
      game.scene.isRecentWin = true;
    } else {
      game.scene.isRecentWin = false;
    }
  }

  render(game: Game) {
    game.renderer.clear();
    game.renderer.drawEntities(game);
    game.renderer.drawField(game);
    game.renderer.drawLevel(game);

    for (let s of game.level.streams) {
      game.renderer.drawStream(s);
    }

    for (let g of game.level.goals) {
      game.renderer.drawGoal(g);
    }

    if (this.sceneState == SceneState.LevelAddingCharge) {
      game.renderer.drawPointCharge(game.inputManager.mousePosition, 1, true);
    }

    for (let b of this.buttons) {
      game.renderer.drawButton(b, game);
    }

    if (game.level.helpText != "") {
      game.renderer.drawText(
        game.level.helpText,
        24,
        new Vector(200, config.height - 50, 0)
      );
    }

    if (game.scene.sceneState == SceneState.LevelWin) {
      game.renderer.drawText(
        "Win",
        256,
        new Vector(config.width / 4, config.height / 2, 0)
      );
    }
  }
}

export class MainMenuScene extends Scene {
  handleEvent(name: string, event: MouseEvent, game: Game) {
    let position = new Vector(event.offsetX, event.offsetY, 0);

    switch (name) {
      case "click": {
        for (let button of this.buttons) {
          if (button.contains(position)) {
            button.action();
            return;
          }
        }
      }
    }
  }
  init(game: Game) {
    this.buttons.push(
      new Button(
        "Play",
        new Vector(config.width / 2 - 70, 200, 0),
        new Vector(150, 60, 0),
        () => {
          game.switchScene(SceneName.Level);
        }
      )
    );

    this.buttons.push(
      new Button(
        "About",
        new Vector(config.width / 2 - 70, 300, 0),
        new Vector(150, 60, 0),
        () => {
          window.location.href = "https://blog.c0nrad.io/posts/plasma-leak/";
        }
      )
    );

    this.buttons.push(
      new Button(
        "Quit",
        new Vector(config.width / 2 - 70, 400, 0),
        new Vector(150, 60, 0),
        () => {
          window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }
      )
    );
  }
  render(game: Game) {
    game.renderer.clear();

    for (let b of this.buttons) {
      game.renderer.drawButton(b, game);
    }

    game.renderer.drawText(
      "Plasma Leak",
      72,
      new Vector(config.width / 2 - 175, 100, 0)
    );

    game.renderer.drawText(
      "A rogue plasma beam is wrecking havoc inside our spacecraft!",
      24,
      new Vector(100, config.height - 150, 0)
    );
    game.renderer.drawText(
      "Use electrically charged particles to bend the plasma beam to safety.",
      24,
      new Vector(100, config.height - 100, 0)
    );
  }
  handleCollisions(game: Game) {}
}

export class EndScene extends Scene {
  handleEvent(name: string, event: MouseEvent, game: Game) {
    let position = new Vector(event.offsetX, event.offsetY, 0);

    switch (name) {
      case "click": {
        for (let button of this.buttons) {
          if (button.contains(position)) {
            button.action();
            return;
          }
        }
      }
    }
  }
  init(game: Game) {
    this.buttons.push(
      new Button(
        "Play",
        new Vector(config.width / 2 - 70, 200, 0),
        new Vector(150, 60, 0),
        () => {
          game.switchScene(SceneName.Level);
        }
      )
    );
  }
  render(game: Game) {
    game.renderer.clear();

    game.renderer.drawText(
      "Plasma Leak",
      72,
      new Vector(config.width / 2 - 175, 100, 0)
    );

    game.renderer.drawText(
      "Win",
      256,
      new Vector(config.width / 4, config.height / 2, 0)
    );

    game.renderer.drawText(
      "You won! I didn't think anyone would get this far, especially you. But congrats anyways.",
      24,
      new Vector(100, config.height - 150, 0)
    );
    game.renderer.drawText(
      "If you liked it, please let me know! c0nrad@c0nrad.io (those are zero's).",
      24,
      new Vector(100, config.height - 100, 0)
    );
    game.renderer.drawText(
      " If you hated it, please let me know at spam@gmail.com",
      24,
      new Vector(100, config.height - 50, 0)
    );
  }
  handleCollisions(game: Game) {}
}
