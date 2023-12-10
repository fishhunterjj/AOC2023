import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  let report: number[][] = [];
  lines.forEach((line) => {
    const toks = line.split(" ");
    report.push(toks.map((reading) => parseInt(reading.trim(), 10)));
  });
  return report;
};

function computeDiffs(input: number[]) {
  let diffs: number[] = [];

  for (let idx = 1; idx < input.length; idx++) {
    diffs.push(input[idx] - input[idx - 1]);
  }

  return diffs;
}

function computeNext(current: number[], prev: number[]) {
  const lastCurrent = current[current.length - 1];
  const diff = prev[prev.length - 1];
  const next = lastCurrent + diff;

  return next;
}

function computePrev(current: number[], prev: number[]) {
  const lastCurrent = current[current.length - 1];
  const diff = prev[prev.length - 1];
  const next = lastCurrent - diff;

  return next;
}

const part1 = (rawInput: string) => {
  const report = parseInput(rawInput);

  console.log(report);

  let predictions: number[] = [];

  report.forEach((recording) => {
    let diffs: number[][] = [];
    let currentRecoding = recording;
    diffs.push(recording);
    let atEnd = currentRecoding.reduce<boolean>(
      (prev, cur) => prev && cur == 0,
      true,
    );
    while (!atEnd) {
      const diff = computeDiffs(currentRecoding);
      atEnd = diff.reduce<boolean>((prev, cur) => prev && cur == 0, true);
      currentRecoding = diff;
      diffs.push(diff);
    }

    console.log(diffs);
    diffs.reverse();
    diffs[0].push(0);

    for (let idx = 1; idx < diffs.length; idx++) {
      const next = computeNext(diffs[idx], diffs[idx - 1]);
      console.log(next);
      diffs[idx].push(next);
    }

    const lastDiff = diffs[diffs.length - 1];
    predictions.push(lastDiff[lastDiff.length - 1]);
  });

  const predSum = predictions.reduce((prev, cur) => prev + cur);

  return predSum;
};

const part2 = (rawInput: string) => {
  const report = parseInput(rawInput);

  console.log(report);

  let predictions: number[] = [];

  report.forEach((recording) => {
    let diffs: number[][] = [];
    let currentRecoding = recording;
    diffs.push(recording);
    let atEnd = currentRecoding.reduce<boolean>(
      (prev, cur) => prev && cur == 0,
      true,
    );
    while (!atEnd) {
      const diff = computeDiffs(currentRecoding);
      atEnd = diff.reduce<boolean>((prev, cur) => prev && cur == 0, true);
      currentRecoding = diff;
      diffs.push(diff);
    }

    console.log(diffs);
    diffs.reverse();
    diffs.forEach((diff) => {
      diff.reverse();
    });
    diffs[0].push(0);

    for (let idx = 1; idx < diffs.length; idx++) {
      const next = computePrev(diffs[idx], diffs[idx - 1]);
      console.log(next);
      diffs[idx].push(next);
    }

    console.log(diffs);

    const lastDiff = diffs[diffs.length - 1];
    predictions.push(lastDiff[lastDiff.length - 1]);
  });

  const predSum = predictions.reduce((prev, cur) => prev + cur);

  return predSum;
};

run({
  part1: {
    tests: [
      {
        input: `
        0 3 6 9 12 15`,
        expected: 18,
      },
      {
        input: `
        1 3 6 10 15 21`,
        expected: 28,
      },
      {
        input: `
        10 13 16 21 30 45`,
        expected: 68,
      },
      {
        input: `
        0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45`,
        expected: 114,
      },
      {
        input: `
        10 2 -10 -20 -20 -6 13 3 -110 -458 -1252 -2806 -5564 -10130 -17301 -28103 -43830 -66086 -96830 -138424 -193684`,
        expected: -265934,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        0 3 6 9 12 15`,
        expected: -3,
      },
      {
        input: `
        1 3 6 10 15 21`,
        expected: 0,
      },
      {
        input: `
        10 13 16 21 30 45`,
        expected: 5,
      },
      {
        input: `
        0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
