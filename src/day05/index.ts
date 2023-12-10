import run from "aocrunner";

enum MAP_TYPE {
  SEED_TO_SOIL,
  SOIL_TO_FERTILIZER,
  FERTILIZER_TO_WATER,
  WATER_TO_LIGHT,
  LIGHT_TO_TEMPERATURE,
  TEMPERATURE_TO_HUMIDITY,
  HUMIDITY_TO_LOCATION,
  UNKNOWN,
}

const mapTypes = [
  MAP_TYPE.SEED_TO_SOIL,
  MAP_TYPE.SOIL_TO_FERTILIZER,
  MAP_TYPE.FERTILIZER_TO_WATER,
  MAP_TYPE.WATER_TO_LIGHT,
  MAP_TYPE.LIGHT_TO_TEMPERATURE,
  MAP_TYPE.TEMPERATURE_TO_HUMIDITY,
  MAP_TYPE.HUMIDITY_TO_LOCATION,
];

type RangeType = {
  destination: number;
  source: number;
  range: number;
};

class RangeMap {
  ranges: RangeType[] = [];
  constructor(mt: MAP_TYPE) {}

  addRange(destination: number, source: number, range: number) {
    const rt: RangeType = { destination, source, range };
    this.ranges.push(rt);
  }

  findDestination(source: number) {
    let ret = source;

    this.ranges.forEach((range) => {
      if (source >= range.source) {
        const diff = source - range.source;
        if (diff < range.range) {
          ret = range.destination + diff;
        }
      }
    });

    return ret;
  }
}

type PROBLEM_SET = {
  seeds: number[];
  maps: Map<MAP_TYPE, RangeMap>;
};

function mapTypeToString(mt: MAP_TYPE) {
  let ret = "";

  const name = MAP_TYPE[mt];

  ret = name.toLowerCase().replaceAll("_", "-");

  return ret;
}

function checkLineForMapType(line: string) {
  let ret = MAP_TYPE.UNKNOWN;
  mapTypes.forEach((mapType) => {
    const typeName = mapTypeToString(mapType);
    if (line.startsWith(typeName)) {
      ret = mapType;
    }
  });

  return ret;
}

function getSeedLocation(seed: number, maps: Map<MAP_TYPE, RangeMap>) {
  let hist: number[] = [seed];
  let currentSource = seed;
  mapTypes.forEach((mapType) => {
    const dest = maps.get(mapType)?.findDestination(currentSource);
    currentSource = dest ?? -1;
    hist.push(currentSource);
  });

  return currentSource;
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  const ps: PROBLEM_SET = {
    seeds: [],
    maps: new Map<MAP_TYPE, RangeMap>(),
  };

  mapTypes.forEach((mapType) => {
    ps.maps.set(mapType, new RangeMap(mapType));
  });

  let activeMapType = MAP_TYPE.UNKNOWN;
  lines.forEach((line) => {
    if (line.startsWith("seeds")) {
      const toks = line.split(":");
      const numToks = toks[1].trim().split(" ");
      ps.seeds = numToks.map((value) => parseInt(value, 10));
    } else {
      const lineMapType = checkLineForMapType(line);
      if (lineMapType != MAP_TYPE.UNKNOWN) {
        // console.log(`Starting ${lineMapType} map section`);
        activeMapType = lineMapType;
      } else if (line.length > 0) {
        // console.log(line);
        const toks = line.trim().split(" ");
        const destination = parseInt(toks[0], 10);
        const source = parseInt(toks[1], 10);
        const length = parseInt(toks[2], 10);
        ps.maps.get(activeMapType)?.addRange(destination, source, length);
      }
    }
  });

  return ps;
};

const part1 = (rawInput: string) => {
  const ps = parseInput(rawInput);

  let minLoc = Infinity;

  ps.seeds.forEach((seed) => {
    minLoc = Math.min(minLoc, getSeedLocation(seed, ps.maps));
  });

  return minLoc;
};

const part2 = (rawInput: string) => {
  const ps = parseInput(rawInput);

  let minLoc = Infinity;

  for (let idx = 0; idx < ps.seeds.length; idx += 2) {
    const seedStart = ps.seeds[idx];
    for (let seedIdx = 0; seedIdx < ps.seeds[idx + 1]; seedIdx++) {
      minLoc = Math.min(minLoc, getSeedLocation(seedStart + seedIdx, ps.maps));
    }
  }

  return minLoc;
};

run({
  part1: {
    tests: [
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48

        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15

        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4

        water-to-light map:
        88 18 7
        18 25 70

        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13

        temperature-to-humidity map:
        0 69 1
        1 0 69

        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 35,
      },
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
