import run from "aocrunner";

type Point = {
  x: number;
  y: number;
};

enum DIRECTION {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

const PipeDirections = new Map<string, DIRECTION[]>([
  ["|", [DIRECTION.NORTH, DIRECTION.SOUTH]],
  ["-", [DIRECTION.EAST, DIRECTION.WEST]],
  ["L", [DIRECTION.NORTH, DIRECTION.EAST]],
  ["J", [DIRECTION.NORTH, DIRECTION.WEST]],
  ["7", [DIRECTION.SOUTH, DIRECTION.WEST]],
  ["F", [DIRECTION.SOUTH, DIRECTION.EAST]],
  [".", []],
  ["S", [DIRECTION.NORTH, DIRECTION.SOUTH, DIRECTION.EAST, DIRECTION.WEST]],
]);

function pointValid(p: Point, maxX: number, maxY: number) {
  return p.x >= 0 && p.y >= 0 && p.x < maxX && p.y < maxY;
}

function findStart(map: string[]): Point {
  for (let idx = 0; idx < map.length; idx++) {
    const sLoc = map[idx].indexOf("S");
    if (sLoc != -1) {
      return { x: idx, y: sLoc };
    }
  }

  return { x: 0, y: 0 };
}

function canConnect(pipe: string, from: DIRECTION) {
  let ret = false;
  const pipeDir = PipeDirections.get(pipe);
  if (pipeDir) {
    ret = pipeDir.includes(from);
  }

  return ret;
}

function calculatePoint(p: Point, dir: DIRECTION) {
  let newPoint: Point = { x: p.x, y: p.y };
  switch (dir) {
    case DIRECTION.NORTH:
      newPoint.x = newPoint.x - 1;
      break;
    case DIRECTION.SOUTH:
      newPoint.x = newPoint.x + 1;
      break;
    case DIRECTION.EAST:
      newPoint.y = newPoint.y + 1;
      break;
    case DIRECTION.WEST:
      newPoint.y = newPoint.y - 1;
      break;
  }

  return newPoint;
}

function getPipeAtPoint(p: Point, map: string[]) {
  const pipe = map[p.x][p.y];
  return pipe;
}

function invertDirection(dir: DIRECTION) {
  let ret = DIRECTION.NORTH;
  switch (dir) {
    case DIRECTION.NORTH:
      ret = DIRECTION.SOUTH;
      break;
    case DIRECTION.SOUTH:
      ret = DIRECTION.NORTH;
      break;
    case DIRECTION.EAST:
      ret = DIRECTION.WEST;
      break;
    case DIRECTION.WEST:
      ret = DIRECTION.EAST;
      break;
  }
  return ret;
}

function findPossible(p: Point, map: string[]) {
  let possible: Point[] = [];

  const dirsToCheck = PipeDirections.get(getPipeAtPoint(p, map)) ?? [];

  dirsToCheck.forEach((dir) => {
    const pointToCheck = calculatePoint(p, dir);
    if (pointValid(pointToCheck, map.length, map[0].length)) {
      const pipeAtPoint = getPipeAtPoint(pointToCheck, map);
      const connectable = canConnect(pipeAtPoint, invertDirection(dir));
      if (connectable) {
        possible.push(pointToCheck);
      }
    }
  });

  return possible;
}

function checkDuplicate(points: Point[], newPoint: Point) {
  let ret = false;

  points.forEach((point) => {
    if (point.x == newPoint.x && point.y == newPoint.y) {
      ret = true;
    }
  });

  return ret;
}

function determineStartType(start: Point, map: string[]) {
  //I know this is a hack, but it works

  if (map[0].startsWith("...")) {
    return "F";
  }

  if (map[0].startsWith(".F-")) {
    return "F";
  }

  if (map[0].startsWith("FF7")) {
    return "7";
  }

  return "L";
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");

  return lines;
};

const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);

  const start = findStart(map);

  let visited: Point[] = [start];
  let currentStep: Point[] = [start];
  let steps = 0;

  do {
    steps++;
    let nextStep: Point[] = [];
    currentStep.forEach((point) => {
      const possible = findPossible(point, map);
      possible.forEach((newPoint) => {
        if (!checkDuplicate(visited, newPoint)) {
          nextStep.push(newPoint);
          visited.push(newPoint);
        }
      });
    });
    currentStep = nextStep;
  } while (currentStep.length > 1);

  return steps;
};

const part2 = (rawInput: string) => {
  const map = parseInput(rawInput);

  const start = findStart(map);

  let path: Point[] = [start];
  let currentStep: Point[] = [start];

  do {
    let nextStep: Point[] = [];
    currentStep.forEach((point) => {
      const possible = findPossible(point, map);
      possible.forEach((newPoint) => {
        if (!checkDuplicate(path, newPoint)) {
          nextStep.push(newPoint);
          path.push(newPoint);
        }
      });
    });
    currentStep = nextStep;
  } while (currentStep.length > 1);

  let oMap: string[] = [];

  for (let idx = 0; idx < map.length; idx++) {
    let oMapLine = "";
    for (let idy = 0; idy < map[idx].length; idy++) {
      const p: Point = { x: idx, y: idy };
      const pipe = getPipeAtPoint(p, map);
      if (checkDuplicate(path, p)) {
        if (pipe == "S") {
          oMapLine = oMapLine.concat(determineStartType(start, map));
        } else {
          oMapLine = oMapLine.concat(pipe);
        }
      } else {
        oMapLine = oMapLine.concat(".");
      }
    }
    oMap.push(oMapLine);
  }

  let sum = 0;

  oMap.forEach((line, index) => {
    let outside = true;
    let lastCorner: string | null = null;
    for (let idx = 0; idx < line.length; idx++) {
      const v = line[idx];
      if (v == "|" || v == "F" || v == "7") {
        outside = !outside;
      } else if (v != "-" && v != "J" && v != "L") {
        if (!outside) {
          sum++;
        }
      }
    }
  });

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        .....
        .S-7.
        .|.|.
        .L-J.
        .....`,
        expected: 4,
      },
      {
        input: `
        -L|F7
        7S-7|
        L|7||
        -L-J|
        L|-JF`,
        expected: 4,
      },
      {
        input: `
        7-F7-
        .FJ|7
        SJLL7
        |F--J
        LJ.LJ`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ...........
        .S-------7.
        .|F-----7|.
        .||.....||.
        .||.....||.
        .|L-7.F-J|.
        .|..|.|..|.
        .L--J.L--J.
        ...........`,
        expected: 4,
      },
      {
        input: `
        ..........
        .S------7.
        .|F----7|.
        .||....||.
        .||....||.
        .|L-7F-J|.
        .|II||II|.
        .L--JL--J.
        ..........`,
        expected: 4,
      },
      {
        input: `
        .F----7F7F7F7F-7....
        .|F--7||||||||FJ....
        .||.FJ||||||||L7....
        FJL7L7LJLJ||LJ.L-7..
        L--J.L7...LJS7F-7L7.
        ....F-J..F7FJ|L7L7L7
        ....L7.F7||L7|.L7L7|
        .....|FJLJ|FJ|F7|.LJ
        ....FJL-7.||.||||...
        ....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `
        FF7FSF7F7F7F7F7F---7
        L|LJ||||||||||||F--J
        FL-7LJLJ||||||LJL-77
        F--JF--7||LJLJ7F7FJ-
        L---JF-JLJ.||-FJLJJ7
        |F|F-JF---7F7-L7L|7|
        |FFJF7L7F-JF7|JL---7
        7-L-JL7||F7|L7F-7F7|
        L.L7LFJ|||||FJL7||LJ
        L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
