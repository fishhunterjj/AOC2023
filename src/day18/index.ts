import run from "aocrunner";

type Point = {
  x: number;
  y: number;
};

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n").map((l) => l.split(" "));
  return lines;
};

function stepToOffset(direction: string, amount: number) {
  let offset: Point = { x: 0, y: 0 };

  switch (direction) {
    case "R":
      offset.y = amount;
      break;
    case "L":
      offset.y = -amount;
      break;
    case "D":
      offset.x = amount;
      break;
    case "U":
      offset.x = -amount;
      break;
  }

  return offset;
}

function computeShoelace(vertices: Point[]) {
  let sum = 0;

  for (let idx = 0; idx < vertices.length; idx++) {
    let p = vertices[idx];
    let p2 = vertices[(idx + 1) % vertices.length];
    sum += p.x * p2.y - p.y * p2.x;
  }

  return Math.abs(sum) / 2;
}

const part1 = (rawInput: string) => {
  const plan = parseInput(rawInput);

  let current: Point = { x: 0, y: 0 };
  let vertices: Point[] = [current];
  let perimeter = 0;

  plan.forEach((step) => {
    const value = Number(step[1]);
    const offset = stepToOffset(step[0], value);
    const next: Point = { x: current.x + offset.x, y: current.y + offset.y };
    vertices.push(next);
    current = next;
    perimeter += value;
  });

  //Shoelace formula to compute area, Pick's theorm to cover area under perimeter
  const area = computeShoelace(vertices) + perimeter / 2 + 1;

  return area;
};

function parseHex(input: string) {
  const sDistance = input.slice(2, 7);
  let dir = "";

  switch (input.slice(7, 8)) {
    case "0":
      dir = "R";
      break;
    case "1":
      dir = "D";
      break;
    case "2":
      dir = "L";
      break;
    case "3":
      dir = "U";
      break;
  }

  return {
    distance: parseInt(sDistance, 16),
    direction: dir,
  };
}

const part2 = (rawInput: string) => {
  const plan = parseInput(rawInput);

  let current: Point = { x: 0, y: 0 };
  let vertices: Point[] = [current];
  let perimeter = 0;

  plan.forEach((step) => {
    const { distance, direction } = parseHex(step[2]);
    const offset = stepToOffset(direction, distance);
    const next: Point = { x: current.x + offset.x, y: current.y + offset.y };
    vertices.push(next);
    current = next;
    perimeter += distance;
  });

  const area = computeShoelace(vertices) + perimeter / 2 + 1;

  return area;
};

run({
  part1: {
    tests: [
      {
        input: `
        R 6 (#70c710)
        D 5 (#0dc571)
        L 2 (#5713f0)
        D 2 (#d2c081)
        R 2 (#59c680)
        D 2 (#411b91)
        L 5 (#8ceee2)
        U 2 (#caa173)
        L 1 (#1b58a2)
        U 2 (#caa171)
        R 2 (#7807d2)
        U 3 (#a77fa3)
        L 2 (#015232)
        U 2 (#7a21e3)`,
        expected: 62,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        R 6 (#70c710)
        D 5 (#0dc571)
        L 2 (#5713f0)
        D 2 (#d2c081)
        R 2 (#59c680)
        D 2 (#411b91)
        L 5 (#8ceee2)
        U 2 (#caa173)
        L 1 (#1b58a2)
        U 2 (#caa171)
        R 2 (#7807d2)
        U 3 (#a77fa3)
        L 2 (#015232)
        U 2 (#7a21e3)`,
        expected: 952408144115,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
