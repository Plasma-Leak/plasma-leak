import { Vector } from "../calculus/vector";
import { config } from "../config/config";
import { Entity } from "../entity/entity";
import { PointCharge } from "../entity/point";
import { Wall } from "../entity/wall";
import { Goal } from "../entity/goal";
import { Stream } from "../entity/stream";

export class Level {
  id: number;
  entities: Entity[];
  goals: Goal[];

  streams: Stream[];
  helpText: string;

  constructor(id: number, entities: Entity[], goals: Goal[]) {
    this.id = id;
    this.entities = entities;
    this.goals = goals;
    this.streams = [];
    this.helpText = "";

    this.addStream(new Vector(10, config.height / 2, 0));
  }

  addStream(position: Vector) {
    let s = new Stream(position);
    s.charge = -1000;
    s.mass = 10;
    s.velocity = new Vector(50, 0, 0);
    s.path = [];
    this.streams.push(s);
  }

  addPoint(position: Vector) {
    this.entities.push(new PointCharge(position));
  }

  addWall(position: Vector, size: Vector) {
    this.entities.push(new Wall(position, size));
  }

  addGoal(position: Vector, size: Vector) {
    this.goals.push(new Goal(position, size));
  }
}

export function loadLevel(i: number): Level {
  switch (i) {
    case 1: {
      let l = new Level(
        1,
        [],
        [new Goal(new Vector(config.width - 20, 100, 0), new Vector(10, 50, 0))]
      );
      l.helpText = "Click 'Add Point' to bend the plasma beam";
      return l;
    }
    case 2: {
      let l = new Level(
        2,
        [
          new Wall(
            new Vector(config.width / 2, 20, 0),
            new Vector(20, (config.height * 3) / 4, 0)
          ),
        ],
        [
          new Goal(
            new Vector(config.width - 20, config.height - 100, 0),
            new Vector(10, 50, 0)
          ),
        ]
      );
      l.helpText = "Bend the plasma beam around the wall";
      return l;
    }
    case 3: {
      let l = new Level(3, [], []);

      l.addWall(
        new Vector(config.width / 4, 0, 0),
        new Vector(20, config.height / 3, 0)
      );

      l.addWall(
        new Vector(config.width / 4, config.height / 3 + 50, 0),
        new Vector(20, (config.height * 2) / 3, 0)
      );

      l.addWall(
        new Vector(config.width / 2, 0, 0),
        new Vector(20, (config.height * 2) / 3, 0)
      );

      l.addWall(
        new Vector(config.width / 2, (config.height * 2) / 3 + 50, 0),
        new Vector(20, config.height / 3, 0)
      );

      l.addWall(
        new Vector((config.width * 3) / 4, 0, 0),
        new Vector(20, config.height / 3, 0)
      );

      l.addWall(
        new Vector((config.width * 3) / 4, config.height / 3 + 50, 0),
        new Vector(20, (config.height * 2) / 3, 0)
      );

      l.addGoal(
        new Vector(config.width - 20, config.height / 2 - 50, 0),
        new Vector(10, 100, 0)
      );
      l.helpText = "You can drag the charges";
      return l;
    }
    case 4: {
      let l = new Level(4, [], []);
      l.streams = [];
      l.addStream(new Vector(10, config.height / 3, 0));
      l.addStream(new Vector(10, (config.height * 2) / 3, 0));

      l.addWall(
        new Vector(config.width / 2, 1, 0),
        new Vector(20, config.height / 3 + 75, 0)
      );

      l.addWall(
        new Vector(config.width / 2, (config.height * 2) / 3 - 75, 0),
        new Vector(20, config.height / 2, 0)
      );

      l.addGoal(
        new Vector(config.width - 20, config.height / 2 - 50, 0),
        new Vector(10, 100, 0)
      );
      l.goals[0].neededStreamCount = 2;
      l.helpText = "Point both beams towards the exit";
      return l;
    }
    case 5: {
      let l = new Level(5, [], []);
      l.streams = [];
      l.addStream(new Vector(10, config.height / 3, 0));
      l.addStream(new Vector(10, (config.height * 2) / 3, 0));

      l.addWall(
        new Vector(config.width / 4, 0, 0),
        new Vector(20, config.height / 3 + 5, 0)
      );

      l.addWall(
        new Vector(config.width / 4, config.height / 3 + 50, 0),
        new Vector(20, (config.height * 2) / 3, 0)
      );

      l.addWall(
        new Vector(config.width / 2, 0, 0),
        new Vector(20, (config.height * 2) / 3, 0)
      );

      l.addWall(
        new Vector(config.width / 2, (config.height * 2) / 3 + 50, 0),
        new Vector(20, config.height / 3, 0)
      );

      l.addWall(
        new Vector((config.width * 3) / 4, 0, 0),
        new Vector(20, config.height / 3, 0)
      );

      l.addWall(
        new Vector((config.width * 3) / 4, config.height / 3 + 50, 0),
        new Vector(20, (config.height * 2) / 3, 0)
      );

      l.addGoal(
        new Vector(config.width - 20, config.height / 2 - 50, 0),
        new Vector(10, 100, 0)
      );
      l.goals[0].neededStreamCount = 2;
      l.helpText = "Good luck.";
      return l;
    }
  }

  console.error("Level not complete");
  return new Level(69, [], []);
}
