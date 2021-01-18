import { Level } from "../game/level";
import { Func, Vector, VectorField } from "../calculus";
import { Game } from "../game/game";
import { PointCharge } from "../entity/point";
import { EntityType } from "../entity/entity";
import { LevelScene, Scene, SceneName, SceneState } from "../render/scene";
import { config } from "../config/config";
import { Stream } from "../entity/stream";

export function calculateTotalFieldAt(position: Vector, game: Game): Vector {
  let out = new Vector(0, 0, 0);
  for (let e of game.level.entities) {
    if (e.type == EntityType.PointCharge) {
      out = out.add(calculateFieldAt(position, <PointCharge>e));
    } else if (e.type == EntityType.Wall || e.type == EntityType.Goal) {
      // nothing
    } else {
      console.log("unknown entity type");
    }
  }

  if (
    game.sceneName == SceneName.Level &&
    (<LevelScene>game.scene).sceneState == SceneState.LevelAddingCharge
  ) {
    out = out.add(
      calculateFieldAt(
        position,
        new PointCharge(game.inputManager.mousePosition)
      )
    );
  }

  return out;
}

function calculateFieldAt(position: Vector, e: PointCharge): Vector {
  let r = position.sub(e.position).magnitude();

  if (r < 15) {
    return new Vector(0, 0, 0);
  }
  let magnitude = e.charge / Math.pow(r, 2);
  let eField = position.sub(e.position).unit().multiplyScalar(magnitude);
  return eField;
}

export function calculateStreamPath(
  game: Game,
  stream: Stream,
  steps: number
): Vector[] {
  let path: Vector[] = [];
  let dt = 0.005;

  let currentPosition = stream.position.clone();
  let currentVelocity = stream.velocity.clone();
  for (let s = 0; s < steps; s++) {
    let field = calculateTotalFieldAt(currentPosition, game);
    let force = field.multiplyScalar(stream.charge);
    let acceleration = force.multiplyScalar(1 / stream.mass);
    currentVelocity.set(currentVelocity.add(acceleration.multiplyScalar(dt)));
    currentPosition.set(
      currentPosition.add(currentVelocity.multiplyScalar(dt))
    );
    path.push(currentPosition.clone());

    if (
      currentPosition.x() < 0 ||
      currentPosition.x() > config.width ||
      currentPosition.y() < 0 ||
      currentPosition.y() > config.height
    ) {
      return path;
    }
  }
  return path;
}
