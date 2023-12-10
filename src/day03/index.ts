import run from "aocrunner";

const parseInput = (rawInput: string) => {
  let schematic: string[] = [];
  const lines = rawInput.split("\n");

  lines.forEach((line) => {
    schematic.push(line);
  });

  return schematic;
};

const symbols = ["@", "#", "$", "%", "&", "*", "/", "+", "-", "="];

function calculate(line: string, col: number) {
  let ret = 0;
  const indexes = [col - 1, col, col + 1];

  const matches = [...line.matchAll(/\d+/g)];

  //   console.log(matches);
  matches.forEach((match) => {
    const value = parseInt(match[0], 10);
    if (match.index != undefined) {
      if (anyIndexInList(indexes, match.index, match[0].length)) {
        ret += value;
      }
    }
  });

  return ret;
}

function anyIndexInList(
  indexsToCheck: number[],
  startIndex: number,
  length: number,
) {
  for (let i = startIndex; i < startIndex + length; i++) {
    if (indexsToCheck.includes(i)) {
      return true;
    }
  }
  return false;
}

const part1 = (rawInput: string) => {
  const schematic = parseInput(rawInput);

  let sum = 0;

  for (let row = 0; row < schematic.length; row++) {
    for (let col = 0; col < schematic[row].length; col++) {
      const c = schematic[row][col];
      if (c == ".") continue;

      if (symbols.includes(c)) {
        sum += calculate(schematic[row - 1], col);
        sum += calculate(schematic[row], col);
        sum += calculate(schematic[row + 1], col);
      }
    }
  }
  return sum;
};

function findMatches(line: string, col: number) {
  let ret: number[] = [];
  const indexes = [col - 1, col, col + 1];

  const matches = [...line.matchAll(/\d+/g)];

  matches.forEach((match) => {
    const value = parseInt(match[0], 10);
    if (match.index != undefined) {
      if (anyIndexInList(indexes, match.index, match[0].length)) {
        ret.push(value);
      }
    }
  });

  return ret;
}

const part2 = (rawInput: string) => {
  const schematic = parseInput(rawInput);

  let sum = 0;

  for (let row = 0; row < schematic.length; row++) {
    for (let col = 0; col < schematic[row].length; col++) {
      const c = schematic[row][col];
      if (c == ".") continue;

      if (c == "*") {
        const upper = findMatches(schematic[row - 1], col);
        const middle = findMatches(schematic[row], col);
        const lower = findMatches(schematic[row + 1], col);

        const merged = upper.concat(middle, lower);

        if (merged.length == 2) {
          sum += merged[0] * merged[1];
        }
      }
    }
  }

  return sum;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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
