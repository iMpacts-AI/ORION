#!/usr/bin/env bash
set -e

echo "======================================================================"
echo "       ORION AI COMMAND SYSTEM — macOS & Linux CLI Installer          "
echo "======================================================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "[!] Node.js is required (>=18.0.0). Please install Node.js from https://nodejs.org"
  exit 1
fi

chmod +x "$SCRIPT_DIR/bin/orion.js"
chmod +x "$SCRIPT_DIR/bin/install-cli.js"

node "$SCRIPT_DIR/bin/install-cli.js"
