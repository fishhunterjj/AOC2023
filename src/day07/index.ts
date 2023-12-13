import run from "aocrunner";

enum HAND_TYPE {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_KIND,
  FULL_HOUSE,
  FOUR_OF_KIND,
  FIVE_OF_KIND,
}

const cardValues = new Map<string, number>([
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["9", 9],
  ["T", 10],
  ["J", 11],
  ["Q", 12],
  ["K", 13],
  ["A", 14],
]);

class Hand {
  cards: string[] = [];
  bid: number;
  handType: HAND_TYPE;

  constructor(cards: string, bid: number, allowJokers: boolean = false) {
    for (let idx = 0; idx < cards.length; idx++) {
      const card = cards.at(idx);
      if (card) {
        this.cards.push(card);
      }
    }

    this.bid = bid;
    this.handType = this.determineHandType(allowJokers);
  }

  determineHandType(allowJokers: boolean) {
    let ht = HAND_TYPE.HIGH_CARD;

    const cardMap = new Map<string, number>();
    this.cards.forEach((card) => {
      const count = cardMap.get(card) ?? 0;
      cardMap.set(card, count + 1);
    });

    const max = Math.max(...cardMap.values());
    let numJacks = 0;
    if (allowJokers) numJacks = cardMap.get("J") ?? 0;

    switch (max) {
      case 5:
        //can't get any better then this
        ht = HAND_TYPE.FIVE_OF_KIND;
        break;
      case 4:
        ht = HAND_TYPE.FOUR_OF_KIND;
        if (numJacks > 0) {
          //AAAAJ
          //JJJJ5
          //upgrade this
          ht = HAND_TYPE.FIVE_OF_KIND;
        }
        break;
      case 3:
        //three of a kind OR full house
        //AAAJJ - 5
        //AAAJ2 - 4
        //JJJKK - 5
        //JJJKQ - 4
        //AAAKK

        let pairFound = false;
        cardMap.forEach((value) => {
          if (value == 2) {
            pairFound = true;
          }
        });

        if (numJacks == 3) {
          if (pairFound) {
            ht = HAND_TYPE.FIVE_OF_KIND;
          } else {
            ht = HAND_TYPE.FOUR_OF_KIND;
          }
        } else if (numJacks == 2) {
          ht = HAND_TYPE.FIVE_OF_KIND;
        } else if (numJacks == 1) {
          ht = HAND_TYPE.FOUR_OF_KIND;
        } else {
          ht = pairFound ? HAND_TYPE.FULL_HOUSE : HAND_TYPE.THREE_OF_KIND;
        }
        break;
      case 2:
        //two pair OR one pair

        //JJ234
        //AAJJ2
        //AAJ22
        //AAJ23
        //AA234

        let pairsFound = 0;
        cardMap.forEach((value) => {
          if (value == 2) {
            pairsFound++;
          }
        });

        switch (numJacks) {
          case 2:
            //Have a pair of Jacks
            switch (pairsFound) {
              case 2:
                //AAJJ2
                ht = HAND_TYPE.FOUR_OF_KIND;
                break;
              case 1:
                //JJ234
                ht = HAND_TYPE.THREE_OF_KIND;
                break;
            }
            break;
          case 1: //1 Jack
            switch (pairsFound) {
              case 2:
                //AAKKJ
                ht = HAND_TYPE.FULL_HOUSE;
                break;
              case 1:
                //AAJKQ
                ht = HAND_TYPE.THREE_OF_KIND;
                break;
            }
            break;
          default:
            ht = pairsFound == 2 ? HAND_TYPE.TWO_PAIR : HAND_TYPE.ONE_PAIR;
        }

        break;

      case 1: //Single cards
        if (numJacks > 0) {
          ht = HAND_TYPE.ONE_PAIR;
        }
        break;
    }

    return ht;
  }
}

//-1 if left is less, 1 is left is more
function compareHands(left: Hand, right: Hand) {
  //check hand type
  if (left.handType < right.handType) return -1;
  if (left.handType > right.handType) return 1;

  //hand types match
  //check for highest hard
  for (let idx = 0; idx < 5; idx++) {
    const leftValue = cardValues.get(left.cards[idx]) ?? 0;
    const rightValue = cardValues.get(right.cards[idx]) ?? 0;

    if (leftValue < rightValue) return -1;
    if (leftValue > rightValue) return 1;
  }

  return 0;
}

const parseInput = (rawInput: string, allowJokers: boolean) => {
  const lines = rawInput.split("\n");

  let hands: Hand[] = [];

  lines.forEach((line) => {
    const toks = line.split(" ");
    const hand = new Hand(toks[0], parseInt(toks[1], 10), allowJokers);
    hands.push(hand);
  });

  return hands;
};

const part1 = (rawInput: string) => {
  const hands = parseInput(rawInput, false);

  const sortedHands = hands.sort((a, b) => compareHands(a, b));

  let winnings = 0;
  sortedHands.forEach((hand, rank) => {
    winnings += (rank + 1) * hand.bid;
  });

  return winnings;
};

const part2 = (rawInput: string) => {
  const hands = parseInput(rawInput, true);

  cardValues.set("J", 1);

  const sortedHands = hands.sort((a, b) => compareHands(a, b));

  let winnings = 0;
  sortedHands.forEach((hand, rank) => {
    winnings += (rank + 1) * hand.bid;
  });

  return winnings;
};

run({
  part1: {
    tests: [
      {
        input: `
        32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483
        `,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483
        `,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
