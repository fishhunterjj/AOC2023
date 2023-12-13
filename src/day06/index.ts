import run from "aocrunner";

type RaceResult = {
  time: number;
  distance: number;
};

function lineToArray(line: string, removeSpaces: boolean) {
  let workLine = line;
  if (removeSpaces) {
    workLine = line.replaceAll(" ", "");
  }
  const matches = [...workLine.matchAll(/\d+/g)];
  return matches.map((value) => parseInt(value[0], 10));
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  return lines;
};

function loadRaces(lines: string[], removeSpaces: boolean) {
  let times: number[] = lineToArray(lines[0], removeSpaces);
  let distances: number[] = lineToArray(lines[1], removeSpaces);

  let results: RaceResult[] = [];

  for (let idx = 0; idx < times.length; idx++) {
    results.push({ time: times[idx], distance: distances[idx] });
  }

  return results;
}

function computeNumWaysToWin(race: RaceResult) {
  let ways = 0;
  for (let ms = 1; ms < race.time; ms++) {
    const timeLeft = race.time - ms;
    const speed = ms;
    const distanceTraveled = timeLeft * speed;

    if (distanceTraveled > race.distance) {
      //   console.log("Win:", ms, distanceTraveled, race);
      ways++;
    }
  }
  return ways;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const races = loadRaces(input, false);

  let wins: number[] = [];

  races.forEach((race) => {
    wins.push(computeNumWaysToWin(race));
  });

  const value = wins.reduce((prev, current) => prev * current);

  return value;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const races = loadRaces(input, true);

  let wins: number[] = [];

  races.forEach((race) => {
    wins.push(computeNumWaysToWin(race));
  });

  const value = wins.reduce((prev, current) => prev * current);

  return value;
};

run({
  part1: {
    tests: [
      {
        input: `
        Time:      7  15   30
        Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Time:      7  15   30
        Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
