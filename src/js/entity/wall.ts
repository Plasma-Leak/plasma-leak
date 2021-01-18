import { Entity, EntityType } from "./entity";
import { Vector } from "../calculus/vector";

export class Wall extends Entity {
  size: Vector;

  constructor(position: Vector, size: Vector) {
    super();
    this.charge = 0;
    this.mass = 0;
    this.position = position;
    this.size = size;
    this.type = EntityType.Wall;
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
