import { Vector } from "../calculus";

export class Button {
  action: () => void;
  text: string;

  size: Vector;
  position: Vector;

  constructor(
    text: string,
    position: Vector,
    size: Vector,
    action: () => void
  ) {
    this.action = action;
    this.text = text;
    this.size = size;
    this.position = position;
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
