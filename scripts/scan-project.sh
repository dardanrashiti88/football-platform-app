#!/usr/bin/env bash
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

RUN_LIVE=false
if [ "${1-}" = "--live" ]; then
  RUN_LIVE=true
fi

pass_count=0
warn_count=0
fail_count=0

pass() {
  pass_count=$((pass_count + 1))
  echo "[PASS] $1"
}

warn() {
  warn_count=$((warn_count + 1))
  echo "[WARN] $1"
}

fail() {
  fail_count=$((fail_count + 1))
  echo "[FAIL] $1"
}

print_section() {
  printf '\n%s\n' "$1"
  printf '%s\n' "--------------------------------"
}

count_files() {
  find "$1" -type f 2>/dev/null | wc -l | tr -d ' '
}

echo "FOD Project Scan"
echo "================================"

auto_dirs=(frontend mobile-version backend db-api Dashboard-view images news monitoring workflows scripts)

print_section "Project map"
for dir in "${auto_dirs[@]}"; do
  if [ -d "$dir" ]; then
    pass "$dir exists ($(count_files "$dir") files)"
  else
    fail "$dir is missing"
  fi
done

print_section "Repo hygiene"
if [ -f .env ]; then
  warn ".env exists locally; keep it untracked and private"
else
  pass ".env is not present in the working tree"
fi

if [ -f .gitignore ] && grep -q '^\.env$' .gitignore; then
  pass ".gitignore protects .env"
else
  fail ".gitignore does not explicitly ignore .env"
fi

mapfile -t temp_files < <(find . -maxdepth 1 -type f \( -name 'tmp_*' -o -name '*.tmp' -o -name '*.bak' \) | sort)
if [ "${#temp_files[@]}" -gt 0 ]; then
  warn "temporary root files found: ${temp_files[*]}"
else
  pass "no obvious temporary root files found"
fi

if git rev-parse --git-dir >/dev/null 2>&1; then
  dirty_output="$(git status --short)"
  if [ -n "$dirty_output" ]; then
    warn "working tree has local changes"
  else
    pass "working tree is clean"
  fi
else
  warn "git repository metadata is not available"
fi

print_section "Workflow and container sanity"
workflow_count=$(find .github/workflows -maxdepth 1 -type f -name '*.yml' 2>/dev/null | wc -l | tr -d ' ')
if [ "$workflow_count" -ge 4 ]; then
  pass ".github/workflows contains $workflow_count workflow files"
else
  fail ".github/workflows looks incomplete ($workflow_count workflow files found)"
fi

if command -v docker >/dev/null 2>&1; then
  if docker compose config >/dev/null 2>&1; then
    pass "docker compose configuration is valid"
  else
    fail "docker compose configuration is invalid"
  fi
else
  warn "docker is not installed in this environment"
fi

print_section "Security spot-check"
if command -v rg >/dev/null 2>&1; then
  secret_hits="$(rg -n --hidden --glob '!**/.git/**' --glob '!**/node_modules/**' --glob '!package-lock.json' --glob '!.env.example' --glob '!README.md' --glob '!scripts/scan-project.sh' '(SMTP_AUTH_PASSWORD=|ghp_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{20,}|sk-[A-Za-z0-9]{20,})' . || true)"
  if [ -n "$secret_hits" ]; then
    warn "potential secret-like strings found; review them carefully"
    echo "$secret_hits"
  else
    pass "no obvious secret-like strings found in tracked project files"
  fi
else
  warn "ripgrep is not installed; skipping secret spot-check"
fi

print_section "Healthcheck"
if $RUN_LIVE; then
  if node scripts/healthcheck.js --live; then
    pass "live healthcheck completed"
  else
    fail "live healthcheck reported issues"
  fi
else
  if node scripts/healthcheck.js; then
    pass "filesystem healthcheck completed"
  else
    fail "filesystem healthcheck reported issues"
  fi
fi

print_section "Summary"
echo "Pass: $pass_count"
echo "Warn: $warn_count"
echo "Fail: $fail_count"

if [ "$fail_count" -gt 0 ]; then
  echo
  echo "Project scan found issues."
  exit 1
fi

echo
echo "Project scan passed."
