import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  return lines;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;

  lines.forEach((line) => {
    const matches = [...line.matchAll(/[0-9]/g)];
    const strNum = `${matches[0][0]}${matches[matches.length - 1][0]}`;
    const value = parseInt(strNum, 10);
    sum += value;
  });

  return sum;
};

const numbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;

  lines.forEach((line) => {
    const matches = [...line.matchAll(/[0-9]/g)];

    //first digit
    let firstIdx = Infinity;
    let firstValue = 0;

    let secondIdx = -1;
    let secondValue = 0;

    if (matches.length > 0) {
      firstIdx = matches[0].index ?? Infinity;
      firstValue = parseInt(matches[0][0], 10);

      secondIdx = matches[matches.length - 1].index ?? -1;
      secondValue = parseInt(matches[matches.length - 1][0], 10);
    }

    numbers.forEach((value, index) => {
      const idx = line.indexOf(value);
      if (idx != -1 && idx < firstIdx) {
        firstIdx = idx;
        firstValue = index + 1;
      }
    });

    //second digit

    numbers.forEach((value, index) => {
      const idx = line.lastIndexOf(value);
      if (idx != -1 && idx >= secondIdx) {
        secondIdx = idx;
        secondValue = index + 1;
      }
    });

    sum += firstValue * 10 + secondValue;
  });

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        1abc2`,
        expected: 12,
      },
      {
        input: `
        pqr3stu8vwx`,
        expected: 38,
      },
      {
        input: `
        a1b2c3d4e5f`,
        expected: 15,
      },
      {
        input: `
        treb7uchet`,
        expected: 77,
      },
      {
        input: `
        1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine`,
        expected: 29,
      },
      {
        input: `
        eightwothree`,
        expected: 83,
      },
      {
        input: `
        abcone2threexyz`,
        expected: 13,
      },
      {
        input: `
        xtwone3four`,
        expected: 24,
      },
      {
        input: `
        4nineeightseven2`,
        expected: 42,
      },
      {
        input: `
        zoneight234`,
        expected: 14,
      },
      {
        input: `
        7pqrstsixteen`,
        expected: 76,
      },
      {
        input: `
        two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
