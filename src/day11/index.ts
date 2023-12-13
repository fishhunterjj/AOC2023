import run from "aocrunner";

type Point = {
  x: number;
  y: number;
};

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  return lines;
};

function expandMap(map: string[]) {
  //expand columns first
  let columnCounts = Array<number>(map[0].length).fill(0);
  let rowCounts = Array<number>(map[0].length).fill(0);

  map.forEach((row, rIdx) => {
    for (let idx = 0; idx < row.length; idx++) {
      if (row[idx] == "#") {
        columnCounts[idx]++;
        rowCounts[rIdx]++;
      }
    }
  });

  let expandedMap: string[] = [];
  const numEmptyCols = columnCounts.reduce(
    (prev, cur) => prev + (cur == 0 ? 1 : 0),
    0,
  );

  map.forEach((row, rIdx) => {
    if (rowCounts[rIdx] == 0) {
      expandedMap.push("!".repeat(columnCounts.length));
      // expandedMap.push(".".repeat(columnCounts.length + numEmptyCols));
    } else {
      let mapLine = "";

      for (let idx = 0; idx < row.length; idx++) {
        if (columnCounts[idx] == 0) {
          mapLine = mapLine.concat("!");
        } else {
          mapLine = mapLine.concat(row[idx]);
        }
      }
      expandedMap.push(mapLine);
    }
  });

  return expandedMap;
}

function getEmptyInfo(map: string[]) {
  let columnCounts = Array<number>(map[0].length).fill(0);
  let rowCounts = Array<number>(map[0].length).fill(0);

  map.forEach((row, rIdx) => {
    for (let idx = 0; idx < row.length; idx++) {
      if (row[idx] == "#") {
        columnCounts[idx]++;
        rowCounts[rIdx]++;
      }
    }
  });

  let emptyCols: number[] = [];
  let emptyRows: number[] = [];

  columnCounts.forEach((value, index) => {
    if (value == 0) emptyCols.push(index);
  });

  rowCounts.forEach((value, index) => {
    if (value == 0) emptyRows.push(index);
  });

  return { columns: emptyCols, rows: emptyRows };
}

function printMap(map: string[]) {
  console.log();
  map.forEach((line, idx) => console.log(idx, line));
  console.log();
}

function findGalaxies(map: string[], expansion: number = 2) {
  let galaxies: Point[] = [];

  let x = 0;
  map.forEach((line, index) => {
    let numG = 0;
    let y = 0;
    for (let idx = 0; idx < line.length; idx++) {
      y += line[idx] == "!" ? expansion : 1;

      if (line[idx] == "#") {
        galaxies.push({ x: x, y: y });
        numG++;
      }
    }

    x += numG > 0 ? 1 : expansion;
  });

  return galaxies;
}

function distance(p1: Point, p2: Point) {
  return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
}

const part1 = (rawInput: string) => {
  const map = parseInput(rawInput);

  const expandedMap = expandMap(map);

  const galaxies = findGalaxies(expandedMap);

  let sum = 0;

  for (let idx = 0; idx < galaxies.length; idx++) {
    for (let idy = idx + 1; idy < galaxies.length; idy++) {
      const dist = distance(galaxies[idx], galaxies[idy]);
      sum += dist;
    }
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const map = parseInput(rawInput);

  const expandedMap = expandMap(map);

  const galaxies = findGalaxies(expandedMap, 1_000_000);

  let sum = 0;

  for (let idx = 0; idx < galaxies.length; idx++) {
    for (let idy = idx + 1; idy < galaxies.length; idy++) {
      const dist = distance(galaxies[idx], galaxies[idy]);
      sum += dist;
    }
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        ...#......
        .......#..
        #.........
        ..........
        ......#...
        .#........
        .........#
        ..........
        .......#..
        #...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: `
      //   ...#......
      //   .......#..
      //   #.........
      //   ..........
      //   ......#...
      //   .#........
      //   .........#
      //   ..........
      //   .......#..
      //   #...#.....`,
      //   // expected: 1030, //expansion of 10
      //   expected: 8410, //expansion of 100
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
