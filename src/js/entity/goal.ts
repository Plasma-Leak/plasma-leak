import { Entity, EntityType } from "./entity";
import { Vector } from "../calculus/vector";

export class Goal extends Entity {
  size: Vector;
  neededStreamCount: number;
  streamCount: number;

  constructor(position: Vector, size: Vector) {
    super();
    this.charge = 0;
    this.mass = 0;
    this.position = position;
    this.size = size;
    this.type = EntityType.Goal;

    this.neededStreamCount = 1;
    this.streamCount = 0;
  }

  contains(position: Vector): boolean {
    return (
      position.x() > this.position.x() &&
      position.x() < this.position.x() + this.size.x() &&
      position.y() > this.position.y() &&
      position.y() < this.position.y() + this.size.y()
    );
  }
}
