import { Vector } from "../calculus";
import { config } from "../config/config";
import { Game } from "../game/game";
import { Level } from "../game/level";
import { calculateTotalFieldAt } from "../physics/physics";
import { Button } from "./button";
import { Wall } from "../entity/wall";
import { Goal } from "../entity/goal";
import { EntityType } from "../entity/entity";
import { Stream } from "../entity/stream";

const GridSpacing = 20;
const StepsPerBall = 500;
export const TestChargeSteps = 10000;

export class Renderer {
  testChargePathBallOffset = 0;

  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear() {
    this.ctx.clearRect(0, 0, config.width, config.height);
  }

  drawEntities(game: Game) {
    for (let entity of game.level.entities) {
      if (entity.type == EntityType.PointCharge) {
        this.drawPointCharge(entity.position, entity.charge, entity.isSelected);
      }

      if (entity.type == EntityType.Wall) {
        this.drawWall(<Wall>entity);
      }
    }
  }

  drawStream(stream: Stream) {
    this.drawPointCharge(stream.position, stream.charge, false);

    let balls = stream.path.length / StepsPerBall;
    let stepSize = 10;
    let steps = stream.path.length;

    if (stream.charge > 0) {
      this.ctx.strokeStyle = "#FF0000";
    } else {
      this.ctx.strokeStyle = "#0000FF";
    }

    this.ctx.beginPath();
    for (let p of stream.path) {
      this.ctx.lineTo(p.x(), p.y());
    }
    this.ctx.stroke();

    for (let i = 0; i < balls; i++) {
      let index = StepsPerBall * i + this.testChargePathBallOffset;

      if (index >= steps) {
        continue;
      }
      let pos = stream.path[index];
      this.drawPointCharge(pos, stream.charge, false);
    }
    this.testChargePathBallOffset =
      (this.testChargePathBallOffset + stepSize) % StepsPerBall;
  }

  drawButton(button: Button, game: Game) {
    this.ctx.fillStyle = "blue";

    this.ctx.fillRect(
      button.position.x(),
      button.position.y(),
      button.size.x(),
      button.size.y()
    );

    this.ctx.font = "24px Comic Sans MS";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      button.text,
      button.position.x() + button.size.x() / 2,
      button.position.y() + button.size.y() / 2 + 5
    );
  }

  drawText(text: string, size: number, position: Vector) {
    this.ctx.font = size.toString() + "px Comic Sans MS";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "left";
    this.ctx.fillText(text, position.x(), position.y());
  }

  drawLevel(game: Game) {
    this.ctx.font = "24px Comic Sans MS";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "left";
    this.ctx.fillText("Level: " + game.level.id.toString() + " / 5", 20, 20);
  }

  drawWall(wall: Wall) {
    this.ctx.fillStyle = "gray";

    this.ctx.fillRect(
      wall.position.x(),
      wall.position.y(),
      wall.size.x(),
      wall.size.y()
    );
  }

  drawGoal(goal: Goal) {
    if (goal.isSelected) {
      this.ctx.fillStyle = "#0000FF";
    } else {
      this.ctx.fillStyle = "#FF0000";
    }
    this.ctx.fillRect(
      goal.position.x(),
      goal.position.y(),
      goal.size.x(),
      goal.size.y()
    );
  }
  drawField(game: Game) {
    for (let x = GridSpacing; x < config.width; x += GridSpacing) {
      for (let y = GridSpacing; y < config.height; y += GridSpacing) {
        let vector = calculateTotalFieldAt(new Vector(x, y, 0), game);
        let magnitude = this.vectorIndicatorLength(vector);
        if (magnitude < 0.1) {
          continue;
        }

        vector = vector.unit().multiplyScalar(magnitude);
        this.ctx.strokeStyle = "#FF0000";

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + vector.x(), y + vector.y());
        this.ctx.stroke();
      }
    }
  }

  vectorIndicatorLength(vector: Vector): number {
    let out = vector.magnitude() * 20;
    if (out >= GridSpacing - 1) {
      return GridSpacing - 1;
    }
    return out;
  }

  drawPointCharge(position: Vector, charge: number, isSelected: boolean) {
    if (charge > 0) {
      this.ctx.fillStyle = "#FF0000";
    } else {
      this.ctx.fillStyle = "#0000FF";
    }
    if (isSelected) {
      // this.ctx.fillStyle = "#00FF00";
    }
    let size = 5;

    this.ctx.beginPath();
    this.ctx.arc(position.x(), position.y(), size, 0, 2 * Math.PI);
    this.ctx.fill();
    // this.ctx.fillRect(
    //   position.x() - size / 2,
    //   position.y() - size / 2,
    //   size,
    //   size
    // );
  }
}
