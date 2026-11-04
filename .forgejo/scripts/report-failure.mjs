// Posts the end of the job output (collected by run-logged.sh) as a comment on
// the pull request, so a failed build can be analysed with an API token. Each
// job keeps one comment, which is updated on every failed run.
//
// Runs with the node binary of the job container (the one actions/checkout
// runs on), so it also works when a setup step failed.
import { readFileSync } from "node:fs";

const MAX_LINES = 150;
const env = process.env;
const api = `${env.GITHUB_API_URL}/repos/${env.GITHUB_REPOSITORY}`;
const runUrl = `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_NUMBER}`;
const marker = `<!-- ci-failure-report job=${env.GITHUB_JOB} -->`;

let output = "";
try {
  output = readFileSync(`${env.RUNNER_TEMP || "/tmp"}/job-output.log`, "utf8");
} catch {
  // No run step wrote anything, the job failed before the first one.
}
const tail = output
  .replace(/\x1b\[[0-9;]*[A-Za-z]/g, "")
  .trimEnd()
  .split("\n")
  .slice(-MAX_LINES)
  .join("\n");

let failedSteps = [];
try {
  failedSteps = Object.entries(JSON.parse(env.STEPS || "{}"))
    .filter(([, step]) => step.outcome === "failure")
    .map(([id]) => `\`${id}\``);
} catch {
  // The steps context is only extra information.
}

// A fence longer than any run of backticks in the output, so it cannot end early.
const fence = "`".repeat(Math.max(3, ...[...tail.matchAll(/`+/g)].map((m) => m[0].length + 1)));

const lines = [
  marker,
  `**CI job \`${env.GITHUB_JOB}\` failed** in [run ${env.GITHUB_RUN_NUMBER}](${runUrl}) on commit \`${(env.HEAD_SHA || "").slice(0, 7)}\`.`,
];
if (failedSteps.length) lines.push("", `Failed step: ${failedSteps.join(", ")}`);
if (tail) {
  lines.push("", `Last ${MAX_LINES} lines of the run step output:`, "", `${fence}text`, tail, fence);
} else {
  lines.push(
    "",
    "No run step wrote any output, so the job failed in an action step (checkout or a setup action) before the first command. The details are only in the job log.",
  );
}
const body = lines.join("\n");

async function call(method, path, payload) {
  const response = await fetch(`${api}${path}`, {
    method,
    headers: { Authorization: `token ${env.TOKEN}`, "Content-Type": "application/json" },
    body: payload && JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`${method} ${path}: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

const comments = await call("GET", `/issues/${env.PR}/comments`);
const existing = comments.find((comment) => comment.body.includes(marker));
if (existing) {
  await call("PATCH", `/issues/comments/${existing.id}`, { body });
  console.log(`Updated comment ${existing.id}`);
} else {
  const created = await call("POST", `/issues/${env.PR}/comments`, { body });
  console.log(`Created comment ${created.id}`);
}
