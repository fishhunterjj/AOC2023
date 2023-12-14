import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  return lines;
};

function mergeNorth(north: string, south: string) {
  let newNorth = "";
  let newSouth = "";
  let moves = 0;

  for (let idx = 0; idx < north.length; idx++) {
    if (south[idx] == "O") {
      if (north[idx] == ".") {
        //Move the rock north
        newNorth = newNorth.concat("O");
        newSouth = newSouth.concat(".");
        moves++;
      } else {
        //Hit another rock, can't move north
        newNorth = newNorth.concat(north[idx]);
        newSouth = newSouth.concat(south[idx]);
      }
    } else {
      //No rock to move
      newNorth = newNorth.concat(north[idx]);
      newSouth = newSouth.concat(south[idx]);
    }
  }

  return { north: newNorth, south: newSouth, moves };
}

function moveNorth(input: string[]) {
  let tilted = input;

  let moves = 0;
  do {
    moves = 0;
    let newtilted: string[] = [];
    let north = tilted[0];
    for (let idx = 1; idx < tilted.length; idx++) {
      const result = mergeNorth(north, tilted[idx]);
      newtilted.push(result.north);
      north = result.south;
      moves += result.moves;
    }
    newtilted.push(north);

    tilted = newtilted;
  } while (moves > 0);

  return tilted;
}

function rotate(input: string[]) {
  let rotated: string[] = [];

  for (let idx = 0; idx < input[0].length; idx++) {
    let line = "";
    for (let idy = input.length - 1; idy >= 0; idy--) {
      line = line.concat(input[idy][idx]);
    }
    rotated.push(line);
  }

  return rotated;
}

function computeLoad(input: string[]) {
  const tInput = input.reverse();
  let load = 0;

  tInput.forEach((line, index) => {
    const matches = [...line.matchAll(/O/g)];
    load += matches.length * (index + 1);
  });

  return load;
}

function spinCycle(input: string[]) {
  const tiltedNorth = moveNorth(input);

  const west = rotate(tiltedNorth);
  const tiltedWest = moveNorth(west);

  const south = rotate(tiltedWest);
  const tiltedSouth = moveNorth(south);

  const east = rotate(tiltedSouth);
  const tiltedEast = moveNorth(east);

  const finalNorth = rotate(tiltedEast);

  return finalNorth;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const tilted = moveNorth(input);

  const load = computeLoad(tilted);

  return load;
};

function getTotalLoadAfterCycles(map: string[], n = 1_000_000_000) {
  const data = new Map<string, number>();
  const key = (map: string[]) => map.join("\n");

  let loopStart: number;
  let loopEnd: number;

  //Build map of cycles
  for (let i = 0; ; i++) {
    //Have we seen this before?
    if (data.has(key(map))) {
      //Assume loop started here
      loopStart = data.get(key(map)) ?? 0;
      //And ended where we are now
      loopEnd = i;
      break;
    }
    //Store the end of the loop
    data.set(key(map), i);
    //computer next cycle of map
    map = spinCycle(map);
  }

  //Compute offset into N
  const loopedPos = ((n - loopStart) % (loopEnd - loopStart)) + loopStart;

  //Find entry that matches offset loop
  for (let [key, cycleN] of data.entries()) {
    if (cycleN === loopedPos) {
      return computeLoad(parseInput(key));
    }
  }
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const load = getTotalLoadAfterCycles(input);

  return load;
};

run({
  part1: {
    tests: [
      {
        input: `
        O....#....
        O.OO#....#
        .....##...
        OO.#O....O
        .O.....O#.
        O.#..O.#.#
        ..O..#O..O
        .......O..
        #....###..
        #OO..#....`,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        O....#....
        O.OO#....#
        .....##...
        OO.#O....O
        .O.....O#.
        O.#..O.#.#
        ..O..#O..O
        .......O..
        #....###..
        #OO..#....`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
