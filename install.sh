#!/usr/bin/env bash
# 把 infra-app-dev skill 软链接到 OpenCode 的 skills 目录。
# 用法：./install.sh [--uninstall]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
TARGET="${OPENCODE_SKILLS_DIR:-$HOME/.config/opencode/skills}"
NAME="infra-app-dev"

mkdir -p "$TARGET"

if [[ "${1:-}" == "--uninstall" ]]; then
  [[ -L "$TARGET/$NAME" ]] && rm "$TARGET/$NAME" && echo "removed $TARGET/$NAME"
  exit 0
fi

[[ -f "$ROOT/skills/$NAME/SKILL.md" ]] || { echo "missing $ROOT/skills/$NAME/SKILL.md" >&2; exit 1; }
ln -sfn "$ROOT/skills/$NAME" "$TARGET/$NAME"
echo "linked $TARGET/$NAME -> $ROOT/skills/$NAME"
echo "完成。重启 OpenCode 或新开会话以加载 skill。"
