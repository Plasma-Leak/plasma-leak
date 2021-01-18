import { Vector } from "../calculus";
import { Game } from "./game";

export class InputManager {
  mousePosition: Vector;

  eventMap: Map<string, (() => void)[]>;

  constructor(canvasElement: HTMLElement, game: Game) {
    this.mousePosition = new Vector(-1000, -1000, -1000);
    this.eventMap = new Map<string, (() => void)[]>();
    canvasElement.addEventListener("click", (e) => {
      this.mousePosition = new Vector(e.offsetX, e.offsetY, 0);
      game.handleEvent("click", e);
    });

    canvasElement.addEventListener("mousemove", (e) => {
      this.mousePosition = new Vector(e.offsetX, e.offsetY, 0);
      game.handleEvent("mousemove", e);
    });

    canvasElement.addEventListener("mousedown", (e) => {
      this.mousePosition = new Vector(e.offsetX, e.offsetY, 0);
      game.handleEvent("mousedown", e);
    });

    canvasElement.addEventListener("mouseup", (e) => {
      this.mousePosition = new Vector(e.offsetX, e.offsetY, 0);
      game.handleEvent("mouseup", e);
    });

    canvasElement.addEventListener("mouseleave", (e) => {
      this.mousePosition = new Vector(-1000, -1000, -1000);
      game.handleEvent("mouseleave", e);
    });
  }
}
