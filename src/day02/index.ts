import run from "aocrunner";

interface Grab {
  red: number;
  blue: number;
  green: number;
}

interface Game {
  id: number;
  grabs: Grab[];
}

function parseLine(line: string) {
  const firstSplit = line.split(":");
  const gameSplit = firstSplit[0].split(" ");
  const gameId = parseInt(gameSplit[1], 10);

  const game: Game = {
    id: gameId,
    grabs: parseGrabs(firstSplit[1]),
  };

  return game;
}

function parseGrabs(data: string) {
  const grabs: Grab[] = [];
  const firstSplit = data.split(";");
  firstSplit.forEach((value) => {
    grabs.push(parseGrab(value));
  });

  return grabs;
}

function parseGrab(data: string): Grab {
  let red = 0;
  let blue = 0;
  let green = 0;

  const toks = data.split(",");
  toks.forEach((value) => {
    const toks = value.trim().split(" ");
    const count = parseInt(toks[0], 10);
    switch (toks[1]) {
      case "red":
        red = count;
        break;
      case "blue":
        blue = count;
        break;
      case "green":
        green = count;
        break;
    }
  });

  const grab = {
    red,
    blue,
    green,
  };

  return grab;
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");

  let games: Game[] = [];

  lines.forEach((line) => {
    games.push(parseLine(line));
  });

  return games;
};

function checkGamePossible(game: Game) {
  let ret = true;

  game.grabs.forEach((grab) => {
    if (grab.red > 12 || grab.blue > 14 || grab.green > 13) {
      ret = false;
    }
  });

  return ret;
}

const part1 = (rawInput: string) => {
  const games = parseInput(rawInput);

  let sum = 0;

  games.forEach((game) => {
    if (checkGamePossible(game)) {
      sum += game.id;
    }
  });

  return sum;
};

function calculatePower(game: Game) {
  let maxRed = 0;
  let maxGreen = 0;
  let maxBlue = 0;

  game.grabs.forEach((grab) => {
    maxRed = Math.max(maxRed, grab.red);
    maxGreen = Math.max(maxGreen, grab.green);
    maxBlue = Math.max(maxBlue, grab.blue);
  });

  const power = maxRed * maxBlue * maxGreen;

  return power;
}

const part2 = (rawInput: string) => {
  const games = parseInput(rawInput);

  let sum = 0;

  games.forEach((game) => {
    sum += calculatePower(game);
  });

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
