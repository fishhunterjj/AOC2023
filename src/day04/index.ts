import run from "aocrunner";

class Card {
  id: number;
  winningNumbers: number[];
  numbers: number[];
  timesCounted: number = 0;

  constructor(id: number, winningNumbers: number[], numbers: number[]) {
    this.id = id;
    this.winningNumbers = winningNumbers;
    this.numbers = numbers;
  }

  static from(data: string): Card {
    const toks1 = data.split(":");
    const cardToks = toks1[0].split(" ");
    const cardId = parseInt(cardToks[1], 10);

    const numbersTok = toks1[1].split("|");
    const winnerToks = numbersTok[0].trim().split(" ");
    const numberToks = numbersTok[1].trim().split(" ");
    const winningNumbers = winnerToks
      .filter((value) => value.length > 0)
      .map((value) => parseInt(value, 10));
    const numbers = numberToks
      .filter((value) => value.length > 0)
      .map((value) => parseInt(value, 10));

    const card = new Card(cardId, winningNumbers, numbers);

    return card;
  }

  countMatches() {
    this.timesCounted++;

    let matches = 0;
    this.numbers.forEach((value) => {
      if (this.winningNumbers.includes(value)) {
        matches++;
      }
    });

    return matches;
  }

  calculatePoints() {
    let points = 0;

    const matches = this.countMatches();
    if (matches > 0) {
      points = Math.pow(2, matches - 1);
    }

    return points;
  }
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");

  let cards: Card[] = [];

  lines.forEach((line) => {
    cards.push(Card.from(line));
  });

  return cards;
};

const part1 = (rawInput: string) => {
  const cards = parseInput(rawInput);

  let totalPoints = 0;

  cards.forEach((card) => {
    const points = card.calculatePoints();
    totalPoints += points;
  });

  return totalPoints;
};

function doMatchChecks(cards: Card[], index: number) {
  const matches = cards[index].countMatches();

  for (let i = 1; i <= matches; i++) {
    doMatchChecks(cards, index + i);
  }
}

const part2 = (rawInput: string) => {
  const cards = parseInput(rawInput);

  for (let i = 0; i < cards.length; i++) {
    doMatchChecks(cards, i);
  }

  let count = 0;
  cards.forEach((card) => {
    count += card.timesCounted;
  });

  return count;
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
