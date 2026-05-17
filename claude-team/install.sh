#!/usr/bin/env bash
# 安裝 AI 敏捷團隊到 ~/.claude/
# 換新電腦 / 換開發環境時，clone 這個 repo 後執行：bash install.sh
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$HOME/.claude"

mkdir -p "$DEST/agents" "$DEST/skills"

# 19 個角色 agent
cp "$DIR"/agents/*.md "$DEST/agents/"

# 6 個通用 skill
cp -r "$DIR"/skills/* "$DEST/skills/"

# 全域 CLAUDE.md（若已存在先備份，避免蓋掉你原有的設定）
if [ -f "$DEST/CLAUDE.md" ]; then
  cp "$DEST/CLAUDE.md" "$DEST/CLAUDE.md.bak"
  echo "ℹ 已備份原有 ~/.claude/CLAUDE.md → ~/.claude/CLAUDE.md.bak"
fi
cp "$DIR/CLAUDE.md" "$DEST/CLAUDE.md"

echo "✅ 完成：19 個 agent、6 個 skill、全域 CLAUDE.md 已安裝到 $DEST"
echo "   重開 Claude Code 後，所有專案即可使用這支 AI 敏捷團隊。"
