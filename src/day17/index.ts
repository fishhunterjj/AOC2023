import { Heap } from "heap-js";
import run from "aocrunner";

interface Position {
  row: number;
  col: number;
  rowDir: number;
  colDir: number;
  consecutive: number;
  heat: number;
}
class Visited {
  visited = new Set<number>();
  constructor(
    private readonly minSteps: number,
    private readonly maxSteps: number,
  ) {}
  check({ row, col, rowDir, colDir, consecutive }: Position): boolean {
    const key =
      (row << 24) |
      (col << 16) |
      ((rowDir & 3) << 14) |
      ((colDir & 3) << 12) |
      consecutive;
    if (this.visited.has(key)) return true;
    if (consecutive >= this.minSteps)
      for (let i = 0; i <= this.maxSteps - consecutive; ++i)
        this.visited.add(key + i);
    else this.visited.add(key);
    return false;
  }
}

function tryDirection(
  map: number[][],
  positions: Heap<Position>,
  pos: Position,
  rowDir: number,
  colDir: number,
  minSteps: number,
  maxSteps: number,
): void {
  const nextRow = pos.row + rowDir;
  const nextCol = pos.col + colDir;
  const sameDirection = rowDir === pos.rowDir && colDir === pos.colDir;

  // Boundary check
  if (
    nextRow < 0 ||
    nextRow >= map.length ||
    nextCol < 0 ||
    nextCol >= map[0].length
  )
    return;
  // Backwards check
  if (rowDir === -pos.rowDir && colDir === -pos.colDir) return;
  // Max steps check
  if (pos.consecutive === maxSteps && sameDirection) return;
  // Min steps check
  if (
    pos.consecutive < minSteps &&
    !sameDirection &&
    !(pos.row === 0 && pos.col === 0)
  )
    return;

  positions.push({
    row: nextRow,
    col: nextCol,
    rowDir,
    colDir,
    consecutive: sameDirection ? pos.consecutive + 1 : 1,
    heat: pos.heat + map[nextRow][nextCol],
  });
}
function minHeat(map: number[][], minSteps: number, maxSteps: number): number {
  const positions = new Heap<Position>((a, b) => a.heat - b.heat);
  // const positions = new Heap();
  const visited = new Visited(minSteps, maxSteps);
  positions.push({
    row: 0,
    col: 0,
    rowDir: 0,
    colDir: 0,
    consecutive: 0,
    heat: 0,
  });
  while (positions.length > 0) {
    const pos = positions.pop() as Position;
    if (visited.check(pos)) continue;
    if (
      pos.row === map.length - 1 &&
      pos.col === map[0].length - 1 &&
      pos.consecutive >= minSteps
    )
      return pos.heat;
    tryDirection(map, positions, pos, 1, 0, minSteps, maxSteps);
    tryDirection(map, positions, pos, -1, 0, minSteps, maxSteps);
    tryDirection(map, positions, pos, 0, 1, minSteps, maxSteps);
    tryDirection(map, positions, pos, 0, -1, minSteps, maxSteps);
  }
  throw new Error("Didn't find anything :(");
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n").map((row) => row.split("").map(Number));
  return lines;
};

const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);

  return minHeat(map, 0, 3);
};

const part2 = (rawInput: string) => {
  const map = parseInput(rawInput);

  return minHeat(map, 4, 10);
};

run({
  part1: {
    tests: [
      {
        input: `
        2413432311323
        3215453535623
        3255245654254
        3446585845452
        4546657867536
        1438598798454
        4457876987766
        3637877979653
        4654967986887
        4564679986453
        1224686865563
        2546548887735
        4322674655533`,
        expected: 102,
      },
      {
        input: `
        11111111111111
        11111111111111
        11111111111111
        66999999999999
        66999999999999
        66999999999999
        66999999999999
        66999999999999
        11999999999999
        91999999999999
        11999999999999
        59999999999999
        11111111111111
        11111111111111`,
        expected: 68,
      },
      {
        input: `
        11199
        12199
        99199
        99131
        99111`,
        expected: 9,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
