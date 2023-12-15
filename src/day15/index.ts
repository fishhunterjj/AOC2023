import run from "aocrunner";

enum OPERATION {
  ADD,
  REMOVE,
}

type Lens = {
  label: string;
  focalLength: number;
};

class LensBox {
  boxNumber: number;
  lenses: Lens[] = [];

  constructor(boxNumber: number) {
    this.boxNumber = boxNumber;
  }

  removeLens(label: string) {
    const idx = this.lenses.findIndex((lens) => lens.label === label);
    if (idx >= 0) {
      this.lenses.splice(idx, 1);
    }
  }

  addLens(label: string, focalLength: number) {
    const idx = this.lenses.findIndex((lens) => lens.label === label);
    const newLens: Lens = { label, focalLength };
    if (idx >= 0) {
      //Found this lens, update focal length
      this.lenses.splice(idx, 1, newLens);
    } else {
      //Not found, add to end
      this.lenses.push(newLens);
    }
  }

  computePower() {
    if (this.lenses.length == 0) return 0;
    const powers = this.lenses.map((lens, idx) => {
      return (this.boxNumber + 1) * (idx + 1) * lens.focalLength;
    });

    return powers.reduce((a, b) => a + b);
  }
}

const parseInput = (rawInput: string) => {
  const steps = rawInput.split(",");
  return steps;
};

function hash(step: string) {
  let hash = 0;

  for (let idx = 0; idx < step.length; idx++) {
    hash += step.charCodeAt(idx);
    hash = (hash * 17) % 256;
  }

  return hash;
}

function parseStep(step: string) {
  const equalIdx = step.indexOf("=");

  if (equalIdx >= 0) {
    //Found an add operation
    const toks = step.split("=");
    const label = toks[0];
    const focalLength = parseInt(toks[1], 10);
    return { label, focalLength, operation: OPERATION.ADD };
  }

  //Not an add
  const label = step.substring(0, step.length - 1);
  return { label, focalLength: 0, operation: OPERATION.REMOVE };
}

const part1 = (rawInput: string) => {
  const steps = parseInput(rawInput);

  const hashes = steps.map((step) => hash(step));
  const sum = hashes.reduce((a, b) => a + b);

  return sum;
};

const part2 = (rawInput: string) => {
  const steps = parseInput(rawInput);

  let lensBoxes: LensBox[] = [];
  for (let idx = 0; idx < 256; idx++) {
    lensBoxes.push(new LensBox(idx));
  }

  steps.forEach((step) => {
    const op = parseStep(step);
    const box = hash(op.label);
    if (op.operation == OPERATION.ADD) {
      lensBoxes[box].addLens(op.label, op.focalLength);
    } else {
      lensBoxes[box].removeLens(op.label);
    }
  });

  const powers = lensBoxes.map((box) => box.computePower());

  return powers.reduce((a, b) => a + b);
};

run({
  part1: {
    tests: [
      {
        input: `HASH`,
        expected: 52,
      },
      {
        input: `rn=1`,
        expected: 30,
      },
      {
        input: `cm-`,
        expected: 253,
      },
      {
        input: `qp=3`,
        expected: 97,
      },
      {
        input: `cm=2`,
        expected: 47,
      },
      {
        input: `qp-`,
        expected: 14,
      },
      {
        input: `pc=4`,
        expected: 180,
      },
      {
        input: `ot=9`,
        expected: 9,
      },
      {
        input: `ab=5`,
        expected: 197,
      },
      {
        input: `pc-`,
        expected: 48,
      },
      {
        input: `pc=6`,
        expected: 214,
      },
      {
        input: `ot=7`,
        expected: 231,
      },
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
