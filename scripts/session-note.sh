#!/bin/sh
# One line for the session start: uncommitted files and age of the last commit.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
n=$(git status --short | wc -l | tr -d ' ')
ago=$(git log -1 --format=%cr 2>/dev/null || echo "no commits")
echo "Git note: $n uncommitted files, last commit $ago"
