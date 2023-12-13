import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");

  let patterns: string[][] = [];
  let pattern: string[] = [];
  lines.forEach((line) => {
    if (line.length > 0) {
      pattern.push(line);
    } else {
      patterns.push(pattern);
      pattern = [];
    }
  });

  if (pattern.length > 0) patterns.push(pattern);

  return patterns;
};

function buildColumns(lines: string[]) {
  let columns = Array<string>(lines[0].length).fill("");
  lines.forEach((line) => {
    for (let idx = 0; idx < line.length; idx++) {
      columns[idx] = columns[idx].concat(line[idx]);
    }
  });

  return columns;
}

function linesMatch(left: string, right: string, allowDiff: boolean) {
  if (allowDiff) {
    return findDiffs(left, right).length <= 1;
  }

  return left == right;
}

function findReflection(
  lines: string[],
  allowDiff: boolean = false,
  ignore: number = -1,
) {
  for (let idx = 0; idx < lines.length - 1; idx++) {
    // console.log("Checking", idx, lines[idx], lines[idx + 1]);
    if (linesMatch(lines[idx], lines[idx + 1], allowDiff)) {
      if (idx == ignore) {
        continue;
      }
      //possible reflection
      let reflection = true;
      for (let idr = idx - 1; idr >= 0; idr--) {
        const left = idr;
        const right = idx + (idx - idr) + 1;
        if (right > lines.length - 1) break;
        if (!linesMatch(lines[left], lines[right], allowDiff)) {
          reflection = false;
        }
      }

      if (reflection) {
        return idx + 1;
      }
    }
  }
}

function findDiffs(left: string, right: string) {
  let diffs: number[] = [];
  for (let idx = 0; idx < left.length; idx++) {
    if (left[idx] != right[idx]) {
      diffs.push(idx);
    }
  }
  return diffs;
}

const part1 = (rawInput: string) => {
  const patterns = parseInput(rawInput);

  let sum = 0;

  patterns.forEach((pattern) => {
    const columns = buildColumns(pattern);

    const vref = findReflection(columns);
    const href = findReflection(pattern);

    const value = (vref ?? 0) + 100 * (href ?? 0);
    sum += value;
  });

  return sum;
};

const part2 = (rawInput: string) => {
  const patterns = parseInput(rawInput);

  let sum = 0;

  patterns.forEach((pattern) => {
    const columns = buildColumns(pattern);

    const vref = findReflection(columns);
    const href = findReflection(pattern);

    //subtract 1 from indexs due to array start at 0
    const vref2 = findReflection(columns, true, (vref ?? 0) - 1);
    const href2 = findReflection(pattern, true, (href ?? 0) - 1);

    let value = 0;

    if (vref) {
      if (vref2 && vref2 != vref) value = vref2;
      if (href2) value = href2 * 100;
    }

    if (href) {
      if (href2 && href2 != href) value = href2 * 100;
      if (vref2) value = vref2;
    }

    if (value == 0) {
      pattern.forEach((l) => console.log(l));
    }

    sum += value;
  });

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        #.##..##.
        ..#.##.#.
        ##......#
        ##......#
        ..#.##.#.
        ..##..##.
        #.#.##.#.`,
        expected: 5,
      },
      {
        input: `
        #...##..#
        #....#..#
        ..##..###
        #####.##.
        #####.##.
        ..##..###
        #....#..#`,
        expected: 400,
      },
      {
        input: `
        #.##..##.
        ..#.##.#.
        ##......#
        ##......#
        ..#.##.#.
        ..##..##.
        #.#.##.#.

        #...##..#
        #....#..#
        ..##..###
        #####.##.
        #####.##.
        ..##..###
        #....#..#`,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        #.##..##.
        ..#.##.#.
        ##......#
        ##......#
        ..#.##.#.
        ..##..##.
        #.#.##.#.`,
        expected: 300,
      },
      {
        input: `
        #...##..#
        #....#..#
        ..##..###
        #####.##.
        #####.##.
        ..##..###
        #....#..#`,
        expected: 100,
      },
      {
        input: `
        #.##..##.
        ..#.##.#.
        ##......#
        ##......#
        ..#.##.#.
        ..##..##.
        #.#.##.#.

        #...##..#
        #....#..#
        ..##..###
        #####.##.
        #####.##.
        ..##..###
        #....#..#`,
        expected: 400,
      },
      {
        input: `
        .########..
        ###.##.####
        #.#....#.##
        ###....####
        .#..##..#..
        ##.#..#.###
        ..######...
        #..#..#..#.
        .#.####.#..`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
