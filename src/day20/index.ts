import run from "aocrunner";

enum PulseState {
  LOW,
  HIGH,
}

type Pulse = {
  state: PulseState;
  destination: string;
  source: string;
};

function LCM(steps: number[]) {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const lcm = (x: number, y: number): number => (x * y) / gcd(x, y);
  return steps.reduce((a, b) => lcm(a, b));
}

class Module {
  public outputs: Module[] = [];
  public inputs: Module[] = [];

  constructor(public name: string) {}

  linkOutput(module: Module) {
    this.outputs.push(module);
  }

  linkInput(module: Module) {
    this.inputs.push(module);
  }

  processPulse(pulse: Pulse): Pulse[] {
    return [];
  }
}

class FlipFlopModule extends Module {
  public on = false;

  processPulse(pulse: Pulse) {
    let output: Pulse[] = [];

    if (pulse.state == PulseState.LOW) {
      this.on = !this.on;

      this.outputs.forEach((module) => {
        const p: Pulse = {
          source: this.name,
          destination: module.name,
          state: this.on ? PulseState.HIGH : PulseState.LOW,
        };
        output.push(p);
      });
    }

    return output;
  }
}

class ConjunctionModule extends Module {
  public inputStates = new Map<string, PulseState>();

  linkInput(module: Module) {
    super.linkInput(module);

    this.inputStates.set(module.name, PulseState.LOW);
  }

  processPulse(pulse: Pulse) {
    let output: Pulse[] = [];

    this.inputStates.set(pulse.source, pulse.state);

    let allHigh = true;
    this.inputStates.forEach((ps) => {
      allHigh = allHigh && ps == PulseState.HIGH;
    });

    this.outputs.forEach((module) => {
      const p: Pulse = {
        source: this.name,
        destination: module.name,
        state: allHigh ? PulseState.LOW : PulseState.HIGH,
      };
      output.push(p);
    });

    return output;
  }
}

class BroadcastModule extends Module {
  processPulse(pulse: Pulse) {
    let output: Pulse[] = [];

    this.outputs.forEach((module) => {
      const p: Pulse = {
        source: this.name,
        destination: module.name,
        state: pulse.state,
      };
      output.push(p);
    });

    return output;
  }
}

class ButtonModule extends Module {
  processPulse(pulse: Pulse) {
    const p: Pulse = {
      source: this.name,
      destination: this.outputs[0].name,
      state: PulseState.LOW,
    };

    return [p];
  }
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  return lines;
};

function linkModule(source: Module | undefined, dest: Module | undefined) {
  if (!source || !dest) {
    return false;
  }

  source.linkOutput(dest);
  dest.linkInput(source);

  return true;
}

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const map = new Map<string, Module>();
  const button = new ButtonModule("button");

  map.set("button", button);

  //First pass to create all the modules
  lines.forEach((line) => {
    const toks = line.split("->").map((l) => l.trim());
    if (toks[0] == "broadcaster") {
      map.set("broadcaster", new BroadcastModule("broadcaster"));
    } else if (toks[0].startsWith("%")) {
      const name = toks[0].slice(1);
      map.set(name, new FlipFlopModule(name));
    } else if (toks[0].startsWith("&")) {
      const name = toks[0].slice(1);
      map.set(name, new ConjunctionModule(name));
    } else {
      const name = toks[0];
      map.set(name, new Module(name));
    }
  });

  //Second pass to link modules
  lines.forEach((line) => {
    const toks = line.split("->").map((l) => l.trim());
    let source = toks[0];
    const toks2 = toks[1].split(",").map((l) => l.trim());

    if (source.startsWith("%") || source.startsWith("&")) {
      source = toks[0].slice(1);
    }

    toks2.forEach((dest) => {
      const sModule = map.get(source);
      let dModule = map.get(dest);
      if (!sModule) {
        console.log("This is really bad");
      }
      if (!dModule) {
        console.log("Dest doesnt exist, creating", dest);
        dModule = new Module(dest);
        map.set(dest, dModule);
      }
      if (!linkModule(map.get(source), map.get(dest))) {
        console.log("bad juju");
      }
    });
  });

  linkModule(button, map.get("broadcaster"));

  let highPulseCount = 0;
  let lowPulseCount = 0;

  //All linked up, start pushing the button
  for (let idx = 0; idx < 1000; idx++) {
    const pulses = button.processPulse({
      source: "elf",
      destination: "button",
      state: PulseState.LOW,
    });
    while (pulses.length) {
      const pulse = pulses.shift() as Pulse;
      const module = map.get(pulse.destination) as Module;
      const output = module.processPulse(pulse);

      if (pulse.state == PulseState.HIGH) {
        highPulseCount++;
      } else {
        lowPulseCount++;
      }

      if (output.length) pulses.push(...output);
    }
  }

  return highPulseCount * lowPulseCount;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const map = new Map<string, Module>();
  const button = new ButtonModule("button");

  map.set("button", button);

  //First pass to create all the modules
  lines.forEach((line) => {
    const toks = line.split("->").map((l) => l.trim());
    if (toks[0] == "broadcaster") {
      map.set("broadcaster", new BroadcastModule("broadcaster"));
    } else if (toks[0].startsWith("%")) {
      const name = toks[0].slice(1);
      map.set(name, new FlipFlopModule(name));
    } else if (toks[0].startsWith("&")) {
      const name = toks[0].slice(1);
      map.set(name, new ConjunctionModule(name));
    } else {
      const name = toks[0];
      map.set(name, new Module(name));
    }
  });

  //Second pass to link modules
  lines.forEach((line) => {
    const toks = line.split("->").map((l) => l.trim());
    let source = toks[0];
    const toks2 = toks[1].split(",").map((l) => l.trim());

    if (source.startsWith("%") || source.startsWith("&")) {
      source = toks[0].slice(1);
    }

    toks2.forEach((dest) => {
      const sModule = map.get(source);
      let dModule = map.get(dest);
      if (!sModule) {
      }
      if (!dModule) {
        dModule = new Module(dest);
        map.set(dest, dModule);
      }
      linkModule(map.get(source), map.get(dest));
    });
  });

  linkModule(button, map.get("broadcaster"));

  //Module that needs to trigger to get RX to trigger
  const rxSource = map.get("rx")?.inputs[0] as Module;

  //Modules that need to trigger to get RX's source to trigger
  const periodic = new Set(rxSource.inputs);

  //The number of button presses needed for each periodic source
  let counts: number[] = [];

  //Run loop until all periodic elements are found
  for (let idx = 1; idx < 1000000; idx++) {
    const pulses = button.processPulse({
      source: "elf",
      destination: "button",
      state: PulseState.LOW,
    });
    while (pulses.length) {
      const pulse = pulses.shift() as Pulse;
      const module = map.get(pulse.destination) as Module;

      //State is going low
      if (pulse.state == PulseState.LOW) {
        //This is one of our states that will get us where we need to go
        if (periodic.has(module)) {
          //Add this count to list
          counts.push(idx);

          //Remove this peridioc from the list
          periodic.delete(module);

          //Check if we are done
          if (periodic.size == 0) {
            break;
          }
        }
      }

      //Do normal pulse processing
      const output = module.processPulse(pulse);

      if (output.length) pulses.push(...output);
    }
  }

  //Since we have the number of button presses to get each periodic to it's sweet spot
  //that'll trigger the rx source to trigger rx properly,
  //find the least common multiple that will make them converge
  const buttonPresses = LCM(counts);

  return buttonPresses;
};

run({
  part1: {
    tests: [
      {
        input: `
        broadcaster -> a, b, c
        %a -> b
        %b -> c
        %c -> inv
        &inv -> a`,
        expected: 32000000,
      },
      {
        input: `
        broadcaster -> a
        %a -> inv, con
        &inv -> b
        %b -> con
        &con -> output`,
        expected: 11687500,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      //   {
      //     input: `
      //     broadcaster -> a
      //     %a -> inv, con
      //     &inv -> b
      //     %b -> con
      //     &con -> rx`,
      //     expected: 1,
      //   },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
