#!/usr/bin/env bash
# ==============================================================================
# ORION installer — macOS, Linux and ChromeOS (Linux / Crostini)
#
#   curl -fsSL https://raw.githubusercontent.com/iMpacts-AI/ORION/main/install.sh | bash
#
# Installs the packaged ORION CLI from the latest GitHub release, verifies its
# SHA-256 checksum, and adds the `orion` command for the current user (no sudo).
#
# Options (environment variables):
#   ORION_VERSION      release tag to install       (default: latest)
#   ORION_INSTALL_DIR  where ORION is installed     (default: ~/.local/share/orion-cli)
#   ORION_BIN_DIR      where the `orion` command goes (default: ~/.local/bin)
# ==============================================================================
set -euo pipefail

REPO="iMpacts-AI/ORION"
MIN_NODE_MAJOR=18
INSTALL_DIR="${ORION_INSTALL_DIR:-$HOME/.local/share/orion-cli}"
BIN_DIR="${ORION_BIN_DIR:-$HOME/.local/bin}"
if [ -n "${ORION_VERSION:-}" ]; then
  BASE_URL="https://github.com/$REPO/releases/download/$ORION_VERSION"
else
  BASE_URL="https://github.com/$REPO/releases/latest/download"
fi

info() { printf '\033[36m[*]\033[0m %s\n' "$*"; }
ok()   { printf '\033[32m[OK]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[!]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[31m[X]\033[0m %s\n' "$*" >&2; exit 1; }

echo ""
echo "  ORION — You tell it. ORION does it."
echo "  ------------------------------------"

case "$(uname -s)" in
  Darwin) PLATFORM="macOS" ;;
  Linux)
    if [ -e /dev/.cros_milestone ] || grep -qi 'penguin' /etc/hostname 2>/dev/null; then PLATFORM="ChromeOS"; else PLATFORM="Linux"; fi ;;
  *) die "Unsupported system. On Windows run:  irm https://raw.githubusercontent.com/$REPO/main/install.ps1 | iex" ;;
esac
info "Installing for $PLATFORM ($(uname -m))"

command -v curl >/dev/null 2>&1 || die "curl is required (e.g. sudo apt install curl)."
command -v tar  >/dev/null 2>&1 || die "tar is required."

# --- Node.js (installed per-user via nvm when missing; no sudo) ---------------
node_major() { node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0; }
if ! command -v node >/dev/null 2>&1 || [ "$(node_major)" -lt "$MIN_NODE_MAJOR" ]; then
  warn "Node.js $MIN_NODE_MAJOR+ not found — installing Node.js LTS for your user (nvm)..."
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  [ -s "$NVM_DIR/nvm.sh" ] || curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
  set +u   # nvm's scripts reference unset variables
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  nvm install --lts >/dev/null
  nvm use --lts >/dev/null
  set -u
fi
[ "$(node_major)" -ge "$MIN_NODE_MAJOR" ] || die "Node.js $MIN_NODE_MAJOR+ is required."
NODE_BIN="$(command -v node)"
ok "Node.js $(node -v)"

# --- Download + verify -------------------------------------------------------
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
info "Downloading ORION..."
curl -fsSL "$BASE_URL/orion-cli.tar.gz" -o "$TMP/orion-cli.tar.gz"
curl -fsSL "$BASE_URL/SHA256SUMS.txt" -o "$TMP/SHA256SUMS.txt"

EXPECTED="$(grep ' orion-cli.tar.gz$' "$TMP/SHA256SUMS.txt" | awk '{print $1}')"
if command -v sha256sum >/dev/null 2>&1; then
  ACTUAL="$(sha256sum "$TMP/orion-cli.tar.gz" | awk '{print $1}')"
else
  ACTUAL="$(shasum -a 256 "$TMP/orion-cli.tar.gz" | awk '{print $1}')"
fi
[ -n "$EXPECTED" ] && [ "$EXPECTED" = "$ACTUAL" ] || die "Download failed its integrity check (SHA-256 mismatch). Nothing was installed."
ok "Download verified (SHA-256)"

# --- Install -------------------------------------------------------------------
tar -xzf "$TMP/orion-cli.tar.gz" -C "$TMP"
rm -rf "$INSTALL_DIR"
mkdir -p "$(dirname "$INSTALL_DIR")" "$BIN_DIR"
mv "$TMP/orion-cli" "$INSTALL_DIR"

cat > "$BIN_DIR/orion" <<EOF
#!/bin/sh
exec "$NODE_BIN" "$INSTALL_DIR/orion.mjs" "\$@"
EOF
chmod +x "$BIN_DIR/orion"

case ":${PATH}:" in
  *":$BIN_DIR:"*) ;;
  *)
    PROFILE_FILE="$HOME/.profile"
    case "${SHELL:-}" in */zsh) PROFILE_FILE="$HOME/.zshrc" ;; */bash) PROFILE_FILE="$HOME/.bashrc" ;; esac
    if ! grep -qs '# ORION CLI' "$PROFILE_FILE"; then
      printf '\n# ORION CLI\nexport PATH="%s:$PATH"\n' "$BIN_DIR" >> "$PROFILE_FILE"
    fi
    warn "Open a new terminal before typing 'orion' (PATH updated in $PROFILE_FILE)."
    ;;
esac

echo ""
ok "ORION $("$NODE_BIN" "$INSTALL_DIR/orion.mjs" --version | sed 's/^ORION //') installed. Type: orion"
echo "    Desktop control (opening apps, typing into windows) is Windows-first today;"
echo "    on $PLATFORM ORION runs the CLI, chat, local models and browser tools."
