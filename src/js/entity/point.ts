import { Vector } from "../calculus/vector";
import { Entity } from "./entity";

export class PointCharge extends Entity {
  radius: number;

  constructor(position: Vector) {
    super();
    this.charge = 1000;
    this.mass = 1;
    this.position = position;
    this.velocity = new Vector(0, 0, 0);

    this.radius = 5;
  }

  contains(position: Vector): boolean {
    return position.sub(this.position).magnitude() < this.radius;
  }
}
