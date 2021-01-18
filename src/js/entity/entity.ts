import { Vector } from "../calculus/vector";
import { VectorField } from "../calculus/vector_field";

export enum EntityType {
  PointCharge,
  Wall,
  Goal,
}

export abstract class Entity {
  mass: number;
  charge: number;
  position: Vector;
  velocity: Vector;
  type: EntityType;

  isSelected: boolean;

  constructor() {
    this.mass = 1;
    this.charge = 0;
    this.position = new Vector(0, 0, 0);
    this.velocity = new Vector(0, 0, 0);

    this.type = EntityType.PointCharge;

    this.isSelected = true;
  }

  abstract contains(position: Vector): boolean;

  // abstract adjustForCollision(position: Vector): Vector;

  // abstract field(): VectorField;
}
