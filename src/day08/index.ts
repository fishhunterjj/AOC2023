import run from "aocrunner";

type Node = {
  left: string;
  right: string;
};

type Network = {
  instructions: string[];
  nodes: Map<string, Node>;
};

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  // lines.forEach((line, idx) => console.log(idx, line))
  let network: Network = { instructions: [], nodes: new Map<string, Node>() };
  for (let idx = 0; idx < lines[0].length; idx++) {
    network.instructions.push(lines[0][idx]);
  }

  for (let idx = 2; idx < lines.length; idx++) {
    const toks1 = lines[idx].split("=");
    const source = toks1[0].trim();
    const toks2 = toks1[1].replace("(", "").replace(")", "").trim().split(",");
    const left = toks2[0].trim();
    const right = toks2[1].trim();

    const node: Node = { left, right };
    network.nodes.set(source, node);
  }

  return network;
};

function LCM(steps: number[]) {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const lcm = (x: number, y: number): number => (x * y) / gcd(x, y);
  return steps.reduce((a, b) => lcm(a, b));
}

function countSteps(network: Network, startNode: string, endNode: string = "") {
  let currentNode = startNode;
  let instructionIdx = 0;
  let atEnd = false;
  let steps = 0;

  do {
    steps++;
    const dir = network.instructions[instructionIdx];

    const curNode = network.nodes.get(currentNode);
    if (curNode) {
      currentNode = dir == "L" ? curNode.left : curNode.right;
    }

    instructionIdx = (instructionIdx + 1) % network.instructions.length;

    if (endNode.length) {
      atEnd = currentNode == endNode;
    } else {
      atEnd = currentNode.endsWith("Z");
    }
  } while (!atEnd);

  return steps;
}

const part1 = (rawInput: string) => {
  const network = parseInput(rawInput);

  const steps = countSteps(network, "AAA", "ZZZ");

  return steps;
};

const part2 = (rawInput: string) => {
  const network = parseInput(rawInput);

  console.log(network);
  let startNodes: string[] = [];
  let steps: number[] = [];

  network.nodes.forEach((node, source) => {
    if (source.endsWith("A")) {
      startNodes.push(source);
      steps.push(countSteps(network, source));
    }
  });

  console.log(startNodes);
  console.log(steps);

  const lcm = LCM(steps);

  return lcm;
};

run({
  part1: {
    tests: [
      {
        input: `
        RL

        AAA = (BBB, CCC)
        BBB = (DDD, EEE)
        CCC = (ZZZ, GGG)
        DDD = (DDD, DDD)
        EEE = (EEE, EEE)
        GGG = (GGG, GGG)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `
        LLR

        AAA = (BBB, BBB)
        BBB = (AAA, ZZZ)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        LR

        11A = (11B, XXX)
        11B = (XXX, 11Z)
        11Z = (11B, XXX)
        22A = (22B, XXX)
        22B = (22C, 22C)
        22C = (22Z, 22Z)
        22Z = (22B, 22B)
        XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
