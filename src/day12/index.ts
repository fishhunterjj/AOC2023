import run from "aocrunner";
import { listenerCount } from "process";

type FieldRow = {
  springs: string;
  damageInfo: number[];
};

//This lets calls that have already been made with the exact params be shortcutted and just have the anser returned
export function memoize<Args extends unknown[], Result>(
  func: (...args: Args) => Result,
): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);
    if (stored.has(k)) {
      return stored.get(k)!;
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}

const countWays = memoize(
  (springs: string, runs: readonly number[]): number => {
    if (springs.length == 0) {
      //No springs left
      if (runs.length == 0) {
        //Also no runs left, so this is good!
        return 1;
      }

      //But there are runs left, so this is a failed path
      return 0;
    }

    if (runs.length == 0) {
      //No runs left but still have something in springs
      if (springs.match(/#/) != null) {
        //Found a damaged spring after the runs ended, no good
        return 0;
      }
      //Didn't find a damaged spring, so this is good
      return 1;
    }

    //Count number of damaged springs needed
    let sumRuns = 0;
    for (const x of runs) {
      sumRuns += x;
    }

    //Count of damaged springs plus the needed gaps
    if (springs.length < sumRuns + runs.length - 1) {
      //Line is not long enough for all runs and gaps
      return 0;
    }

    if (springs[0] === ".") {
      //Known non-damaged point, skip it and start with next spring
      return countWays(springs.slice(1), runs);
    }

    if (springs[0] == "#") {
      //Found a damaged spring
      const [run, ...leftOverRuns] = runs;
      for (let i = 0; i < run; i++) {
        if (springs[i] === ".") {
          //Found a known non-damaged spring before the run was over, not good
          return 0;
        }
      }
      if (springs[run] == "#") {
        //Have a damaged spring as the next one after the run,
        // so no gap, not good.
        return 0;
      }

      //Run is good, continue processing with data after the run
      //and with all other runs
      return countWays(springs.slice(run + 1), leftOverRuns);
    }

    //Hit a ?, we can count the ways with both options(damaged/non-damaged)
    return (
      countWays("#" + springs.slice(1), runs) +
      countWays("." + springs.slice(1), runs)
    );
  },
);

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  let rows: FieldRow[] = [];

  lines.forEach((line) => {
    const toks = line.split(" ");

    const field: FieldRow = { springs: toks[0], damageInfo: [] };

    const info = toks[1].split(",");
    field.damageInfo = info.map((v) => parseInt(v, 10));

    rows.push(field);
  });

  return rows;
};

const part1 = (rawInput: string) => {
  const rows = parseInput(rawInput);

  let sum = 0;

  rows.forEach((row) => {
    sum += countWays(row.springs, row.damageInfo);
  });

  return sum;
};

const part2 = (rawInput: string) => {
  const rows = parseInput(rawInput);

  let sum = 0;

  rows.forEach((row) => {
    const expandedRow = [
      row.springs,
      row.springs,
      row.springs,
      row.springs,
      row.springs,
    ].join("?");

    const expandedInfo = [
      ...row.damageInfo,
      ...row.damageInfo,
      ...row.damageInfo,
      ...row.damageInfo,
      ...row.damageInfo,
    ];

    sum += countWays(expandedRow, expandedInfo);
  });

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
        ???.### 1,1,3`,
        expected: 1,
      },
      {
        input: `
        .??..??...?##. 1,1,3`,
        expected: 4,
      },
      {
        input: `
        ?#?#?#?#?#?#?#? 1,3,1,6`,
        expected: 1,
      },
      {
        input: `
        ????.#...#... 4,1,1`,
        expected: 1,
      },
      {
        input: `
        ????.######..#####. 1,6,5`,
        expected: 4,
      },
      {
        input: `
        ?###???????? 3,2,1`,
        expected: 10,
      },
      {
        input: `
        ???.### 1,1,3
        .??..??...?##. 1,1,3
        ?#?#?#?#?#?#?#? 1,3,1,6
        ????.#...#... 4,1,1
        ????.######..#####. 1,6,5
        ?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ???.### 1,1,3`,
        expected: 1,
      },
      {
        input: `
        .??..??...?##. 1,1,3`,
        expected: 16384,
      },
      {
        input: `
        ?#?#?#?#?#?#?#? 1,3,1,6`,
        expected: 1,
      },
      {
        input: `
        ????.#...#... 4,1,1`,
        expected: 16,
      },
      {
        input: `
        ????.######..#####. 1,6,5`,
        expected: 2500,
      },
      {
        input: `
        ?###???????? 3,2,1`,
        expected: 506250,
      },
      {
        input: `
        ???.### 1,1,3
        .??..??...?##. 1,1,3
        ?#?#?#?#?#?#?#? 1,3,1,6
        ????.#...#... 4,1,1
        ????.######..#####. 1,6,5
        ?###???????? 3,2,1`,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
