import run from "aocrunner";
import { relative } from "path";

type PartRating = {
  x?: number;
  m?: number;
  a?: number;
  s?: number;
};

type Rule = {
  below?: boolean;
  above?: boolean;
  x?: number;
  m?: number;
  a?: number;
  s?: number;
  accept?: boolean;
  reject?: boolean;
  workflow?: string;
};

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");

  // let workflows: Workflow[] = [];
  let workflows = new Map<string, Rule[]>();
  let ratings: PartRating[] = [];

  lines.forEach((line) => {
    if (line.length == 0) return;

    if (line.startsWith("{")) {
      //Part rating
      let rating: PartRating = {};
      const toks = line.split(",");
      toks.forEach((tok) => {
        const tokToks = tok.replaceAll("}", "").split("=");
        const value = Number(tokToks[1]);
        if (tok.includes("x=")) {
          rating.x = value;
        } else if (tok.includes("m=")) {
          rating.m = value;
        } else if (tok.includes("a=")) {
          rating.a = value;
        } else if (tok.includes("s=")) {
          rating.s = value;
        }
      });
      ratings.push(rating);
    } else {
      //Workflow
      const workflowName = line.substring(0, line.indexOf("{"));
      let workflowRules: Rule[] = [];

      const rulesPart = line.substring(
        line.indexOf("{") + 1,
        line.indexOf("}"),
      );
      // console.log(name, rulesPart);
      // const workflow: Workflow = { name, rules: [] };
      // console.log("Created workflow", name);
      const rulesToks = rulesPart.split(",");
      rulesToks.forEach((rulePart) => {
        let rule: Rule = {};
        // console.log("Rule part", rulePart);
        rule.accept = rulePart.includes("A");
        rule.reject = rulePart.includes("R");
        rule.above = rulePart.includes(">");
        rule.below = rulePart.includes("<");

        if (rule.above || rule.below) {
          const moreToks = rulePart.split(rule.above ? ">" : "<");
          // console.log(moreToks);
          const moreToks2 = moreToks[1].split(":");
          const value = Number(moreToks2[0]);
          switch (moreToks[0]) {
            case "m":
              rule.m = value;
              break;
            case "x":
              rule.x = value;
              break;
            case "s":
              rule.s = value;
              break;
            case "a":
              rule.a = value;
              break;
          }
          if (!rule.accept && !rule.reject) rule.workflow = moreToks2[1];
        } else {
          if (!rule.accept && !rule.reject) rule.workflow = rulePart;
        }

        // console.log(rule);
        workflowRules.push(rule);
      });
      workflows.set(workflowName, workflowRules);
    }
  });

  return { ratings, workflows };
};

function evaluateRule(rule: Rule, part: PartRating) {
  let accepted = false;
  let rejected = false;
  let refWorkflow = "";

  if (rule.m) {
    if (rule.above) {
      if (part.m > rule.m) {
        accepted = rule.accept ?? false;
        rejected = rule.reject ?? false;
        refWorkflow = rule.workflow ?? "";
      }
    } else if (rule.below) {
      if (part.m < rule.m) {
        accepted = rule.accept ?? false;
        rejected = rule.reject ?? false;
        refWorkflow = rule.workflow ?? "";
      }
    }
  } else if (rule.s) {
    if (rule.above) {
      if (part.s > rule.s) {
        accepted = rule.accept ?? false;
        rejected = rule.reject ?? false;
        refWorkflow = rule.workflow ?? "";
      }
    } else if (rule.below) {
      if (part.s < rule.s) {
        accepted = rule.accept ?? false;
        rejected = rule.reject ?? false;
        refWorkflow = rule.workflow ?? "";
      }
    }
  } else if (rule.x) {
    if (rule.above) {
      if (part.x > rule.x) {
        accepted = rule.accept ?? false;
        rejected = rule.reject ?? false;
        refWorkflow = rule.workflow ?? "";
      }
    } else if (rule.below) {
      if (part.x < rule.x) {
        accepted = rule.accept ?? false;
        rejected = rule.reject ?? false;
        refWorkflow = rule.workflow ?? "";
      }
    }
  } else if (rule.a) {
    if (rule.above) {
      if (part.a > rule.a) {
        accepted = rule.accept ?? false;
        rejected = rule.reject ?? false;
        refWorkflow = rule.workflow ?? "";
      }
    } else if (rule.below) {
      if (part.a < rule.a) {
        accepted = rule.accept ?? false;
        rejected = rule.reject ?? false;
        refWorkflow = rule.workflow ?? "";
      }
    }
  } else if (rule.accept) {
    accepted = true;
  } else if (rule.reject) {
    rejected = true;
  } else {
    refWorkflow = rule.workflow ?? "";
  }

  return {
    accepted,
    rejected,
    refWorkflow,
  };
}

function evaluateWorkflow(workflow: Rule[], part: PartRating) {
  let accepted = false;
  let rejected = false;
  let refWorkflow = "";

  for (let idx = 0; idx < workflow.length; idx++) {
    const results = evaluateRule(workflow[idx], part);

    if (
      results.accepted ||
      results.rejected ||
      results.refWorkflow.length > 0
    ) {
      accepted = results.accepted;
      rejected = results.rejected;
      refWorkflow = results.refWorkflow;

      break;
    }
  }

  return {
    accepted,
    rejected,
    refWorkflow,
  };
}

function testAcceptance(part: PartRating, workflows: Map<string, Rule[]>) {
  let accepted = false;

  let workflow = workflows.get("in");

  // console.log(part);
  while (workflow) {
    const results = evaluateWorkflow(workflow, part);
    // console.log(results);
    workflow = workflows.get(results.refWorkflow);
    accepted = results.accepted;
  }

  return accepted;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // input.workflows.forEach((workflow) => {
  //   console.log(workflow.name);
  //   workflow.rules.forEach((rule) => {
  //     console.log("   ", rule);
  //   });
  // });

  let sum = 0;

  input.ratings.forEach((part) => {
    if (testAcceptance(part, input.workflows)) {
      sum += part.x + part.a + part.m + part.s;
    }
  });

  return sum;
};

const [MIN, MAX] = [0, 1];

type State = {
  name: string;
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
};

function copyState(s: State, name: string): State {
  return {
    name,
    x: [s.x[MIN], s.x[MAX]],
    m: [s.m[MIN], s.m[MAX]],
    a: [s.a[MIN], s.a[MAX]],
    s: [s.s[MIN], s.s[MAX]],
  };
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const start: State = {
    name: "in",
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };

  const queue: State[] = [start];
  let combinations = 0;

  while (queue.length) {
    const current = queue.shift() as State;

    if (current.name == "R") {
      continue;
    }

    if (current.name == "A") {
      combinations +=
        (1 + current.x[MAX] - current.x[MIN]) *
        (1 + current.m[MAX] - current.m[MIN]) *
        (1 + current.a[MAX] - current.a[MIN]) *
        (1 + current.s[MAX] - current.s[MIN]);
      continue;
    }
    const workflow = input.workflows.get(current.name);
    workflow?.forEach((rule) => {
      const nextName = rule.accept
        ? "A"
        : rule.reject
        ? "R"
        : rule.workflow ?? "";
      const next = copyState(current, nextName);
      if (rule.below) {
        if (rule.x) {
          next.x[MAX] = Math.min(next.x[MAX], rule.x - 1);
          current.x[MIN] = Math.max(current.x[MIN], next.x[MAX] + 1);
        } else if (rule.m) {
          next.m[MAX] = Math.min(next.m[MAX], rule.m - 1);
          current.m[MIN] = Math.max(current.m[MIN], next.m[MAX] + 1);
        } else if (rule.a) {
          next.a[MAX] = Math.min(next.a[MAX], rule.a - 1);
          current.a[MIN] = Math.max(current.a[MIN], next.a[MAX] + 1);
        } else if (rule.s) {
          next.s[MAX] = Math.min(next.s[MAX], rule.s - 1);
          current.s[MIN] = Math.max(current.s[MIN], next.s[MAX] + 1);
        }
      } else {
        if (rule.x) {
          next.x[MIN] = Math.max(next.x[MIN], rule.x + 1);
          current.x[MAX] = Math.min(current.x[MAX], next.x[MIN] - 1);
        } else if (rule.m) {
          next.m[MIN] = Math.max(next.m[MIN], rule.m + 1);
          current.m[MAX] = Math.min(current.m[MAX], next.m[MIN] - 1);
        } else if (rule.a) {
          next.a[MIN] = Math.max(next.a[MIN], rule.a + 1);
          current.a[MAX] = Math.min(current.a[MAX], next.a[MIN] - 1);
        } else if (rule.s) {
          next.s[MIN] = Math.max(next.s[MIN], rule.s + 1);
          current.s[MAX] = Math.min(current.s[MAX], next.s[MIN] - 1);
        }
      }
      queue.push(next);
    });
  }

  return combinations;
};

run({
  part1: {
    tests: [
      {
        input: `
        px{a<2006:qkq,m>2090:A,rfg}
        pv{a>1716:R,A}
        lnx{m>1548:A,A}
        rfg{s<537:gd,x>2440:R,A}
        qs{s>3448:A,lnx}
        qkq{x<1416:A,crn}
        crn{x>2662:A,R}
        in{s<1351:px,qqz}
        qqz{s>2770:qs,m<1801:hdj,R}
        gd{a>3333:R,R}
        hdj{m>838:A,pv}

        {x=787,m=2655,a=1222,s=2876}
        {x=1679,m=44,a=2067,s=496}
        {x=2036,m=264,a=79,s=2244}
        {x=2461,m=1339,a=466,s=291}
        {x=2127,m=1623,a=2188,s=1013}`,
        expected: 19114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        px{a<2006:qkq,m>2090:A,rfg}
        pv{a>1716:R,A}
        lnx{m>1548:A,A}
        rfg{s<537:gd,x>2440:R,A}
        qs{s>3448:A,lnx}
        qkq{x<1416:A,crn}
        crn{x>2662:A,R}
        in{s<1351:px,qqz}
        qqz{s>2770:qs,m<1801:hdj,R}
        gd{a>3333:R,R}
        hdj{m>838:A,pv}

        {x=787,m=2655,a=1222,s=2876}
        {x=1679,m=44,a=2067,s=496}
        {x=2036,m=264,a=79,s=2244}
        {x=2461,m=1339,a=466,s=291}
        {x=2127,m=1623,a=2188,s=1013}`,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
