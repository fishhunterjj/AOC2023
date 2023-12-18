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

type BEAM = {
  position: Point;
  dir: DIRECTION;
  currentTile: Tile;
  active: boolean;
};

class Tile {
  energized: boolean = false;
  enteredDirs: DIRECTION[] = [];

  constructor(public x: number, public y: number, public type: string) {}

  //Returns true if a beam has already come in from this direction
  processBeamEntry(travelDirection: DIRECTION) {
    let newDirs: DIRECTION[] = [];

    this.energized = true;

    if (!this.enteredDirs.includes(travelDirection)) {
      //Haven't entered from this direction, so let's calculate new directions
      switch (this.type) {
        case ".":
          newDirs.push(travelDirection);
          break;
        case "|":
          if (
            travelDirection == DIRECTION.EAST ||
            travelDirection == DIRECTION.WEST
          ) {
            newDirs.push(DIRECTION.NORTH);
            newDirs.push(DIRECTION.SOUTH);
          } else {
            newDirs.push(travelDirection);
          }
          break;
        case "-":
          if (
            travelDirection == DIRECTION.NORTH ||
            travelDirection == DIRECTION.SOUTH
          ) {
            newDirs.push(DIRECTION.EAST, DIRECTION.WEST);
          } else {
            newDirs.push(travelDirection);
          }
          break;
        case "/":
          switch (travelDirection) {
            case DIRECTION.NORTH:
              newDirs.push(DIRECTION.EAST);
              break;
            case DIRECTION.SOUTH:
              newDirs.push(DIRECTION.WEST);
              break;
            case DIRECTION.EAST:
              newDirs.push(DIRECTION.NORTH);
              break;
            case DIRECTION.WEST:
              newDirs.push(DIRECTION.SOUTH);
              break;
          }
          break;
        case "\\":
          switch (travelDirection) {
            case DIRECTION.NORTH:
              newDirs.push(DIRECTION.WEST);
              break;
            case DIRECTION.SOUTH:
              newDirs.push(DIRECTION.EAST);
              break;
            case DIRECTION.EAST:
              newDirs.push(DIRECTION.SOUTH);
              break;
            case DIRECTION.WEST:
              newDirs.push(DIRECTION.NORTH);
              break;
          }
          break;
      }
    }

    this.enteredDirs.push(travelDirection);

    return newDirs;
  }

  reset() {
    this.energized = false;
    this.enteredDirs = [];
  }
}

function calculatePoint(p: Point, dir: DIRECTION) {
  let newPoint = { x: p.x, y: p.y };
  switch (dir) {
    case DIRECTION.NORTH:
      newPoint.x -= 1;
      break;
    case DIRECTION.SOUTH:
      newPoint.x += 1;
      break;
    case DIRECTION.EAST:
      newPoint.y += 1;
      break;
    case DIRECTION.WEST:
      newPoint.y -= 1;
      break;
  }

  return newPoint;
}

function findTile(p: Point, tiles: Tile[]) {
  const x = tiles.filter((tile) => tile.x == p.x && tile.y == p.y);

  if (x.length > 0) {
    return x[0];
  }

  return null;
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");

  let tiles: Tile[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    for (let idy = 0; idy < lines[idx].length; idy++) {
      const t = new Tile(idx, idy, lines[idx][idy]);
      tiles.push(t);
    }
  }

  return tiles;
};

function computeEnergized(
  startingPoint: Point,
  startingDirection: DIRECTION,
  tiles: Tile[],
) {
  let beams: BEAM[] = [];
  const startTile = findTile(startingPoint, tiles);

  if (startTile) {
    const beam: BEAM = {
      dir: startingDirection,
      position: startingPoint,
      currentTile: startTile,
      active: true,
    };

    beams.push(beam);
  }

  let beamCount = 1;

  do {
    beams.forEach((beam) => {
      if (!beam.active) return;

      const newDirs = beam.currentTile.processBeamEntry(beam.dir);

      if (newDirs.length == 0) {
        beam.active = false;
      }

      let originalPos = beam.position;

      if (newDirs.length >= 1) {
        beam.position = calculatePoint(beam.position, newDirs[0]);
        const nextTile = findTile(beam.position, tiles);

        if (nextTile) {
          beam.dir = newDirs[0];
          beam.currentTile = nextTile;
        } else {
          beam.active = false;
        }
      }

      if (newDirs.length > 1) {
        //multiple new directions, create new one
        const nextPoint = calculatePoint(originalPos, newDirs[1]);
        const nextTile = findTile(nextPoint, tiles);

        if (nextTile) {
          const newBeam: BEAM = {
            position: nextPoint,
            dir: newDirs[1],
            currentTile: nextTile,
            active: true,
          };

          beams.push(newBeam);
        }
      }
    });

    // console.log(beams);

    beamCount = beams.filter((beam) => beam.active).length;
    // beamCount = 0;
  } while (beamCount > 0);

  let energized = tiles.filter((tile) => tile.energized);

  return energized.length;
}

function resetTiles(tiles: Tile[]) {
  tiles.forEach((tile) => tile.reset());
}

const part1 = (rawInput: string) => {
  const tiles = parseInput(rawInput);

  return computeEnergized({ x: 0, y: 0 }, DIRECTION.EAST, tiles);
};

const part2 = (rawInput: string) => {
  const tiles = parseInput(rawInput);

  let maxX = 0;
  let maxY = 0;

  tiles.forEach((tile) => {
    maxX = Math.max(maxX, tile.x);
    maxY = Math.max(maxY, tile.y);
  });

  let energizedCounts: number[] = [];

  for (let idx = 0; idx < maxX; idx++) {
    energizedCounts.push(
      computeEnergized({ x: idx, y: 0 }, DIRECTION.EAST, tiles),
    );
    resetTiles(tiles);

    energizedCounts.push(
      computeEnergized({ x: idx, y: maxY }, DIRECTION.WEST, tiles),
    );
    resetTiles(tiles);
  }

  for (let idy = 0; idy < maxY; idy++) {
    energizedCounts.push(
      computeEnergized({ x: 0, y: idy }, DIRECTION.SOUTH, tiles),
    );
    resetTiles(tiles);

    energizedCounts.push(
      computeEnergized({ x: maxX, y: idy }, DIRECTION.NORTH, tiles),
    );
    resetTiles(tiles);
  }

  return Math.max(...energizedCounts);
};

run({
  part1: {
    tests: [
      {
        input: `
        .|...\\....
        |.-.\\.....
        .....|-...
        ........|.
        ..........
        .........\\
        ..../.\\\\..
        .-.-/..|..
        .|....-|.\\
        ..//.|....`,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        .|...\\....
        |.-.\\.....
        .....|-...
        ........|.
        ..........
        .........\\
        ..../.\\\\..
        .-.-/..|..
        .|....-|.\\
        ..//.|....`,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
