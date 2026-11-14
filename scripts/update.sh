#!/usr/bin/env bash
# 从 today-infrastructure 重新生成全部 skill 内容。
# 用法：./scripts/update.sh [--offline]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS="${INFRA_DOCS:-$ROOT/../today-infrastructure/infra-docs}"
REPO="${INFRA_REPO:-$ROOT/../today-infrastructure}"
cd "$ROOT"

if [[ ! -d "$DOCS" ]]; then
  echo "找不到 infra-docs：$DOCS" >&2
  echo "用 INFRA_DOCS=/path/to/infra-docs 指定" >&2
  exit 1
fi

echo "==> extract"
node scripts/extract.mjs --docs "$DOCS"
echo "==> build-refs"
node scripts/build-refs.mjs
echo "==> build-modules"
node scripts/build-modules.mjs --repo "$REPO"

if [[ "${1:-}" == "--offline" && -f data/llms.txt ]]; then
  echo "==> sync-context7 (offline)"
  node scripts/sync-context7.mjs --offline
else
  echo "==> sync-context7"
  node scripts/sync-context7.mjs
fi

echo "==> verify"
node scripts/verify.mjs
