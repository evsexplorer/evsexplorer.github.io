#!/usr/bin/env bash
# Shell of the run steps (defaults.run.shell in the workflows). Runs the step
# script the same way `shell: bash` does and also appends its output to a file
# of the job. report-failure.mjs posts the end of that file to the pull request
# when the job fails, because the job log itself is only served to a browser
# session and not through the API.
set -o pipefail
bash --noprofile --norc -eo pipefail "$1" 2>&1 | tee -a "${RUNNER_TEMP:-/tmp}/job-output.log"
